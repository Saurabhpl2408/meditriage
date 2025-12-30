#!/bin/bash

# RAG Service Test Script

set -e

echo "🧪 Testing MediTriage RAG Service"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

RAG_URL="http://localhost:8000"

# Test 1: Health Check
echo "Test 1: Health Check"
response=$(curl -s "${RAG_URL}/health")
if echo "$response" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo "✗ Health check failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 2: Get Model Info
echo "Test 2: Get Model Info"
response=$(curl -s "${RAG_URL}/model/info")
if echo "$response" | grep -q "model_name"; then
    echo -e "${GREEN}✓ Model info retrieved${NC}"
    echo "   Model: $(echo $response | grep -o '"model_name":"[^"]*"' | cut -d'"' -f4)"
else
    echo "✗ Model info failed"
    exit 1
fi
echo ""

# Test 3: Get Collection Info
echo "Test 3: Get Collection Info"
response=$(curl -s "${RAG_URL}/collection/info")
if echo "$response" | grep -q "count"; then
    echo -e "${GREEN}✓ Collection info retrieved${NC}"
    count=$(echo $response | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "   Documents in collection: $count"
else
    echo "✗ Collection info failed"
    exit 1
fi
echo ""

# Test 4: Add Single Document
echo "Test 4: Add Single Document"
response=$(curl -s -X POST "${RAG_URL}/documents/add" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Aspirin is a common medication used to reduce pain, fever, and inflammation. It works by blocking the production of prostaglandins.",
    "metadata": {
      "category": "treatment",
      "topic": "aspirin",
      "source": "pharmacology"
    }
  }')

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ Document added${NC}"
else
    echo "✗ Failed to add document"
    echo "$response"
    exit 1
fi
echo ""

# Test 5: Query Knowledge Base
echo "Test 5: Query Knowledge Base (fever)"
response=$(curl -s -X POST "${RAG_URL}/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the symptoms of fever?",
    "top_k": 3
  }')

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ Query successful${NC}"
    result_count=$(echo $response | grep -o '"count":[0-9]*' | cut -d':' -f2 | head -1)
    echo "   Found $result_count results"
else
    echo "✗ Query failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 6: Query with Filter
echo "Test 6: Query with Category Filter"
response=$(curl -s -X POST "${RAG_URL}/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "treatment options",
    "top_k": 5,
    "filter_category": "treatment"
  }')

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ Filtered query successful${NC}"
else
    echo "✗ Filtered query failed"
    exit 1
fi
echo ""

# Test 7: Add Batch Documents
echo "Test 7: Add Batch Documents (from sample file)"
if [ -f "rag-service/data/sample_medical_docs.json" ]; then
    response=$(curl -s -X POST "${RAG_URL}/documents/add-batch" \
      -H "Content-Type: application/json" \
      -d @rag-service/data/sample_medical_docs.json)
    
    if echo "$response" | grep -q "success"; then
        echo -e "${GREEN}✓ Batch documents added${NC}"
        total=$(echo $response | grep -o '"total_chunks":[0-9]*' | cut -d':' -f2)
        echo "   Added $total total chunks"
    else
        echo "✗ Batch add failed"
        echo "$response"
    fi
else
    echo "${YELLOW}⚠ Sample documents file not found, skipping${NC}"
fi
echo ""

# Test 8: Query Medical Topic
echo "Test 8: Query Medical Topic (chest pain)"
response=$(curl -s -X POST "${RAG_URL}/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What causes chest pain and when should I seek emergency care?",
    "top_k": 3,
    "similarity_threshold": 0.5
  }')

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✓ Medical query successful${NC}"
else
    echo "✗ Medical query failed"
    exit 1
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "=================================="
echo ""
echo "RAG Service is working correctly!"
echo ""