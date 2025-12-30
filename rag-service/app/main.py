# MediTriage RAG Service - Main Application

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
from app.config import get_settings
from app.api import router
from app.utils.logger import logger

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events"""
    # Startup
    logger.info("🧠 Starting RAG Service...")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Embedding Model: {settings.embedding_model}")
    logger.info(f"ChromaDB: {settings.chroma_persist_dir}")
    
    # Pre-load models (optional - will load on first request otherwise)
    try:
        from app.models.embeddings import get_embedding_model
        from app.services.chroma_service import get_chroma_service
        
        embedding_model = get_embedding_model(
            settings.embedding_model,
            settings.embedding_device
        )
        
        chroma_service = get_chroma_service(
            settings.chroma_persist_dir,
            settings.chroma_collection_name,
            embedding_model,
            settings.chroma_distance_metric
        )
        
        logger.info(f"✅ Services initialized. Collection has {chroma_service.collection.count()} documents")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down RAG Service...")


# Create FastAPI app
app = FastAPI(
    title="MediTriage RAG Service",
    description="Medical knowledge retrieval using vector search",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - {response.status_code} - {duration:.3f}s"
    )
    
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.environment == "development" else "An error occurred"
        }
    )


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        from app.services.chroma_service import get_chroma_service
        from app.models.embeddings import get_embedding_model
        
        # Check if services can be initialized
        embedding_model = get_embedding_model(
            settings.embedding_model,
            settings.embedding_device
        )
        
        chroma_service = get_chroma_service(
            settings.chroma_persist_dir,
            settings.chroma_collection_name,
            embedding_model,
            settings.chroma_distance_metric
        )
        
        collection_count = chroma_service.collection.count()
        
        return {
            "status": "healthy",
            "service": "rag-service",
            "version": "1.0.0",
            "embedding_model": settings.embedding_model,
            "collection": {
                "name": settings.chroma_collection_name,
                "count": collection_count
            },
            "timestamp": time.time()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "MediTriage RAG Service",
        "version": "1.0.0",
        "description": "Medical knowledge retrieval using vector search",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "query": "/query (POST)",
            "add_document": "/documents/add (POST)",
            "collection_info": "/collection/info (GET)"
        },
        "model": settings.embedding_model
    }


# Include API routes
app.include_router(router, tags=["RAG Operations"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.rag_service_host,
        port=settings.rag_service_port,
        reload=settings.environment == "development"
    )