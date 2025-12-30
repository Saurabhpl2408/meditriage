# ChromaDB Vector Database Service

import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Optional, Any
from loguru import logger
from functools import lru_cache
import uuid


class ChromaService:
    """Service for interacting with ChromaDB vector database"""
    
    def __init__(
        self,
        persist_directory: str,
        collection_name: str,
        embedding_function: Any,
        distance_metric: str = "cosine"
    ):
        """
        Initialize ChromaDB service
        
        Args:
            persist_directory: Directory to persist database
            collection_name: Name of the collection
            embedding_function: Embedding function to use
            distance_metric: Distance metric ('cosine', 'l2', 'ip')
        """
        logger.info(f"Initializing ChromaDB at {persist_directory}")
        
        try:
            # Create ChromaDB client
            self.client = chromadb.PersistentClient(
                path=persist_directory,
                settings=ChromaSettings(
                    anonymized_telemetry=False,
                    allow_reset=True
                )
            )
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=collection_name,
                metadata={"hnsw:space": distance_metric}
            )
            
            self.collection_name = collection_name
            self.embedding_function = embedding_function
            
            logger.info(f"Collection '{collection_name}' ready. Count: {self.collection.count()}")
            
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            raise
    
    def add_documents(
        self,
        documents: List[str],
        metadatas: List[Dict[str, Any]],
        ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Add documents to the collection
        
        Args:
            documents: List of document texts
            metadatas: List of metadata dicts
            ids: Optional list of IDs (auto-generated if not provided)
            
        Returns:
            Dictionary with operation results
        """
        try:
            # Generate IDs if not provided
            if ids is None:
                ids = [str(uuid.uuid4()) for _ in documents]
            
            # Generate embeddings
            logger.info(f"Generating embeddings for {len(documents)} documents")
            embeddings = self.embedding_function.encode(documents, show_progress=True)
            
            # Add to collection
            self.collection.add(
                documents=documents,
                embeddings=embeddings.tolist(),
                metadatas=metadatas,
                ids=ids
            )
            
            logger.info(f"Added {len(documents)} documents to collection")
            
            return {
                "success": True,
                "count": len(documents),
                "ids": ids
            }
            
        except Exception as e:
            logger.error(f"Failed to add documents: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def query(
        self,
        query_text: str,
        top_k: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Query the collection
        
        Args:
            query_text: Query text
            top_k: Number of results to return
            filter_metadata: Optional metadata filter
            
        Returns:
            Dictionary with query results
        """
        try:
            # Generate query embedding
            query_embedding = self.embedding_function.encode_query(query_text)
            
            # Query collection
            results = self.collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=top_k,
                where=filter_metadata
            )
            
            # Format results
            formatted_results = []
            
            if results['ids'] and len(results['ids'][0]) > 0:
                for i in range(len(results['ids'][0])):
                    formatted_results.append({
                        "id": results['ids'][0][i],
                        "document": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                        "distance": results['distances'][0][i] if results['distances'] else None,
                        "score": 1 - results['distances'][0][i] if results['distances'] else None
                    })
            
            logger.info(f"Query returned {len(formatted_results)} results")
            
            return {
                "success": True,
                "query": query_text,
                "count": len(formatted_results),
                "results": formatted_results
            }
            
        except Exception as e:
            logger.error(f"Query failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "results": []
            }
    
    def delete_documents(self, ids: List[str]) -> Dict[str, Any]:
        """Delete documents by IDs"""
        try:
            self.collection.delete(ids=ids)
            logger.info(f"Deleted {len(ids)} documents")
            return {"success": True, "deleted_count": len(ids)}
        except Exception as e:
            logger.error(f"Failed to delete documents: {e}")
            return {"success": False, "error": str(e)}
    
    def get_collection_info(self) -> Dict[str, Any]:
        """Get collection information"""
        try:
            count = self.collection.count()
            return {
                "name": self.collection_name,
                "count": count,
                "metadata": self.collection.metadata
            }
        except Exception as e:
            logger.error(f"Failed to get collection info: {e}")
            return {"error": str(e)}
    
    def reset_collection(self) -> Dict[str, Any]:
        """Reset (clear) the collection"""
        try:
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.create_collection(name=self.collection_name)
            logger.warning(f"Collection '{self.collection_name}' reset")
            return {"success": True, "message": "Collection reset"}
        except Exception as e:
            logger.error(f"Failed to reset collection: {e}")
            return {"success": False, "error": str(e)}


@lru_cache(maxsize=1)
def get_chroma_service(
    persist_directory: str,
    collection_name: str,
    embedding_function: Any,
    distance_metric: str = "cosine"
) -> ChromaService:
    """Get cached ChromaDB service instance"""
    return ChromaService(
        persist_directory,
        collection_name,
        embedding_function,
        distance_metric
    )