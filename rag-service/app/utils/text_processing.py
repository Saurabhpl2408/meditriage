# Text Processing Utilities

from typing import List, Dict, Any
import re
from loguru import logger


def chunk_text(
    text: str,
    chunk_size: int = 512,
    overlap: int = 50,
    separator: str = "\n\n"
) -> List[str]:
    """
    Split text into chunks with overlap
    
    Args:
        text: Text to split
        chunk_size: Maximum chunk size in characters
        overlap: Overlap size between chunks
        separator: Separator to split on
        
    Returns:
        List of text chunks
    """
    # Split by separator first
    paragraphs = text.split(separator)
    
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        # If paragraph itself is larger than chunk_size, split it
        if len(para) > chunk_size:
            # Split by sentences
            sentences = re.split(r'(?<=[.!?])\s+', para)
            for sentence in sentences:
                if len(current_chunk) + len(sentence) < chunk_size:
                    current_chunk += sentence + " "
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = sentence + " "
        else:
            if len(current_chunk) + len(para) < chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"
    
    # Add the last chunk
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    # Add overlap
    if overlap > 0 and len(chunks) > 1:
        overlapped_chunks = []
        for i, chunk in enumerate(chunks):
            if i > 0:
                # Add overlap from previous chunk
                prev_chunk = chunks[i-1]
                overlap_text = prev_chunk[-overlap:] if len(prev_chunk) > overlap else prev_chunk
                chunk = overlap_text + " " + chunk
            overlapped_chunks.append(chunk)
        return overlapped_chunks
    
    return chunks


def clean_text(text: str) -> str:
    """
    Clean and normalize text
    
    Args:
        text: Text to clean
        
    Returns:
        Cleaned text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters (keep basic punctuation)
    text = re.sub(r'[^\w\s.,!?;:()\-]', '', text)
    
    # Normalize line breaks
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    return text.strip()


def extract_metadata_from_text(text: str, source: str = "") -> Dict[str, Any]:
    """
    Extract metadata from text
    
    Args:
        text: Text content
        source: Source identifier
        
    Returns:
        Dictionary with metadata
    """
    metadata = {
        "source": source,
        "length": len(text),
        "word_count": len(text.split()),
    }
    
    # Try to extract title (first line or heading)
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if line and len(line) < 100:
            metadata["title"] = line
            break
    
    # Check if it's about a specific medical topic
    medical_keywords = {
        "symptom": ["symptom", "sign", "indication"],
        "condition": ["disease", "condition", "disorder", "syndrome"],
        "treatment": ["treatment", "therapy", "medication", "drug"],
        "prevention": ["prevention", "avoid", "reduce risk"]
    }
    
    text_lower = text.lower()
    for category, keywords in medical_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            metadata["category"] = category
            break
    
    return metadata


def summarize_text(text: str, max_length: int = 200) -> str:
    """
    Create a simple extractive summary
    
    Args:
        text: Text to summarize
        max_length: Maximum summary length
        
    Returns:
        Summary text
    """
    # Get first few sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    summary = ""
    for sentence in sentences:
        if len(summary) + len(sentence) < max_length:
            summary += sentence + " "
        else:
            break
    
    return summary.strip() + "..." if len(summary) < len(text) else summary.strip()