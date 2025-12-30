# Embedding Model Wrapper

from sentence_transformers import SentenceTransformer
from typing import List, Union
import numpy as np
from loguru import logger
from functools import lru_cache


class EmbeddingModel:
    """Wrapper for embedding model"""
    
    def __init__(self, model_name: str, device: str = "cpu"):
        """
        Initialize embedding model
        
        Args:
            model_name: Name of the model (e.g., 'sentence-transformers/all-MiniLM-L6-v2')
            device: Device to run on ('cpu', 'cuda', 'mps')
        """
        logger.info(f"Loading embedding model: {model_name} on {device}")
        
        try:
            self.model = SentenceTransformer(model_name, device=device)
            self.dimension = self.model.get_sentence_embedding_dimension()
            self.model_name = model_name
            self.device = device
            
            logger.info(f"Model loaded successfully. Dimension: {self.dimension}")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    
    def encode(
        self, 
        texts: Union[str, List[str]], 
        batch_size: int = 32,
        show_progress: bool = False
    ) -> np.ndarray:
        """
        Generate embeddings for text(s)
        
        Args:
            texts: Single text or list of texts
            batch_size: Batch size for processing
            show_progress: Show progress bar
            
        Returns:
            Numpy array of embeddings
        """
        try:
            # Convert single string to list
            if isinstance(texts, str):
                texts = [texts]
            
            # Generate embeddings
            embeddings = self.model.encode(
                texts,
                batch_size=batch_size,
                show_progress_bar=show_progress,
                convert_to_numpy=True
            )
            
            return embeddings
        
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise
    
    def encode_query(self, query: str) -> np.ndarray:
        """
        Generate embedding for a single query
        
        Args:
            query: Query text
            
        Returns:
            Numpy array embedding
        """
        return self.encode(query)[0]
    
    def get_dimension(self) -> int:
        """Get embedding dimension"""
        return self.dimension
    
    def get_model_info(self) -> dict:
        """Get model information"""
        return {
            "model_name": self.model_name,
            "dimension": self.dimension,
            "device": self.device,
            "max_seq_length": self.model.max_seq_length
        }


@lru_cache(maxsize=1)
def get_embedding_model(model_name: str, device: str = "cpu") -> EmbeddingModel:
    """
    Get cached embedding model instance
    
    Args:
        model_name: Model name
        device: Device to use
        
    Returns:
        EmbeddingModel instance
    """
    return EmbeddingModel(model_name, device)