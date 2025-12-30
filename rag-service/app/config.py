# RAG Service Configuration

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    rag_service_port: int = 8000
    rag_service_host: str = "0.0.0.0"
    environment: str = "development"
    
    # ChromaDB
    chroma_persist_dir: str = "/data/chromadb"
    chroma_collection_name: str = "medical_knowledge"
    chroma_distance_metric: str = "cosine"
    
    # Embeddings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    embedding_device: str = "cpu"
    
    # OpenAI (optional)
    openai_api_key: str = ""
    
    # AWS S3
    aws_region: str = "us-east-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    s3_bucket_name: str = "meditriage-docs"
    s3_documents_prefix: str = "medical-documents/"
    
    # Document Processing
    max_chunk_size: int = 512
    chunk_overlap: int = 50
    max_documents_per_batch: int = 100
    
    # Retrieval
    default_top_k: int = 5
    max_top_k: int = 20
    similarity_threshold: float = 0.7
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    # Cache
    enable_cache: bool = True
    cache_ttl: int = 3600
    
    # Rate Limiting
    max_requests_per_minute: int = 60
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()