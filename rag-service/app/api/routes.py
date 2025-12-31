# RAG Service API Routes

from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.services.chroma_service import get_chroma_service
from app.models.embeddings import get_embedding_model
from app.config import get_settings
from app.utils import chunk_text, clean_text, extract_metadata_from_text, logger

router = APIRouter()
settings = get_settings()

# Initialize services lazily
_chroma_service = None
_embedding_model = None


def get_services():
    """Get or initialize services"""
    global _chroma_service, _embedding_model
    
    if _embedding_model is None:
        _embedding_model = get_embedding_model(
            settings.embedding_model,
            settings.embedding_device
        )
    
    if _chroma_service is None:
        _chroma_service = get_chroma_service(
            settings.chroma_persist_dir,
            settings.chroma_collection_name,
            _embedding_model,
            settings.chroma_distance_metric
        )
    
    return _chroma_service, _embedding_model


# Request/Response Models
class QueryRequest(BaseModel):
    query: str = Field(..., description="Search query text")
    top_k: int = Field(5, ge=1, le=20, description="Number of results")
    filter_category: Optional[str] = Field(None, description="Filter by category")
    similarity_threshold: Optional[float] = Field(None, ge=0.0, le=1.0)


class QueryResponse(BaseModel):
    success: bool
    query: str
    count: int
    results: List[Dict[str, Any]]


class AddDocumentRequest(BaseModel):
    content: str = Field(..., description="Document content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata")
    chunk: bool = Field(True, description="Whether to chunk the document")


class AddDocumentsRequest(BaseModel):
    documents: List[Dict[str, Any]] = Field(..., description="List of documents")
    chunk: bool = Field(True, description="Whether to chunk documents")


class CollectionInfo(BaseModel):
    name: str
    count: int
    metadata: Dict[str, Any]


@router.post("/query", response_model=QueryResponse)
async def query_knowledge(request: QueryRequest):
    """
    Query the medical knowledge base
    
    Search for relevant medical information using semantic search.
    """
    try:
        chroma_service, _ = get_services()
        
        # Build filter
        filter_metadata = None
        if request.filter_category:
            filter_metadata = {"category": request.filter_category}
        
        # Query
        result = chroma_service.query(
            query_text=request.query,
            top_k=request.top_k,
            filter_metadata=filter_metadata
        )
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Query failed'))
        
        # Filter by similarity threshold if provided
        if request.similarity_threshold:
            result['results'] = [
                r for r in result['results'] 
                if r.get('score', 0) >= request.similarity_threshold
            ]
            result['count'] = len(result['results'])
        
        return QueryResponse(**result)
    
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/documents/add")
async def add_document(request: AddDocumentRequest):
    """
    Add a single document to the knowledge base
    
    Documents are automatically chunked and embedded.
    """
    try:
        chroma_service, _ = get_services()
        
        # Clean content
        content = clean_text(request.content)
        
        # Chunk if requested
        if request.chunk:
            chunks = chunk_text(
                content,
                chunk_size=settings.max_chunk_size,
                overlap=settings.chunk_overlap
            )
        else:
            chunks = [content]
        
        # Prepare documents
        documents = []
        metadatas = []
        
        for i, chunk in enumerate(chunks):
            documents.append(chunk)
            
            # Build metadata
            metadata = {
                **request.metadata,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
            
            # Extract additional metadata if not provided
            if not request.metadata:
                metadata.update(extract_metadata_from_text(chunk))
            
            metadatas.append(metadata)
        
        # Add to ChromaDB
        result = chroma_service.add_documents(
            documents=documents,
            metadatas=metadatas
        )
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Failed to add document'))
        
        logger.info(f"Added document with {len(chunks)} chunks")
        
        return {
            "success": True,
            "message": f"Added {len(chunks)} chunk(s)",
            "chunks": len(chunks),
            "ids": result.get('ids', [])
        }
    
    except Exception as e:
        logger.error(f"Failed to add document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/documents/add-batch")
async def add_documents_batch(documents: List[Dict[str, Any]]):
    """
    Add multiple documents in batch
    
    Efficient for ingesting large amounts of data.
    Accepts an array of documents directly.
    """
    try:
        chroma_service, _ = get_services()
        
        all_documents = []
        all_metadatas = []
        
        for doc in documents:
            content = clean_text(doc.get('content', ''))
            metadata = doc.get('metadata', {})
            
            # Chunk the content
            chunks = chunk_text(
                content,
                chunk_size=settings.max_chunk_size,
                overlap=settings.chunk_overlap
            )
            
            for i, chunk in enumerate(chunks):
                all_documents.append(chunk)
                all_metadatas.append({
                    **metadata,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                })
        
        # Add all at once
        result = chroma_service.add_documents(
            documents=all_documents,
            metadatas=all_metadatas
        )
        
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Batch add failed'))
        
        logger.info(f"Added {len(all_documents)} chunks from {len(documents)} documents")
        
        return {
            "success": True,
            "message": f"Added {len(documents)} document(s)",
            "total_chunks": len(all_documents),
            "ids": result.get('ids', [])
        }
    
    except Exception as e:
        logger.error(f"Batch add failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collection/info", response_model=CollectionInfo)
async def get_collection_info():
    """
    Get information about the knowledge base collection
    """
    try:
        chroma_service, _ = get_services()
        info = chroma_service.get_collection_info()
        
        if 'error' in info:
            raise HTTPException(status_code=500, detail=info['error'])
        
        return CollectionInfo(**info)
    
    except Exception as e:
        logger.error(f"Failed to get collection info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/collection/reset")
async def reset_collection():
    """
    Reset (clear) the entire collection
    
    WARNING: This deletes all documents!
    """
    try:
        chroma_service, _ = get_services()
        result = chroma_service.reset_collection()
        
        if not result.get('success'):
            raise HTTPException(status_code=500, detail=result.get('error', 'Reset failed'))
        
        logger.warning("Collection reset - all documents deleted")
        
        return result
    
    except Exception as e:
        logger.error(f"Failed to reset collection: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model/info")
async def get_model_info():
    """Get embedding model information"""
    try:
        _, embedding_model = get_services()
        return embedding_model.get_model_info()
    
    except Exception as e:
        logger.error(f"Failed to get model info: {e}")
        raise HTTPException(status_code=500, detail=str(e))