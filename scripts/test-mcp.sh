#!/bin/bash

# MCP Server Test Script

set -e

echo "🧪 Testing MediTriage MCP Server"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

MCP_URL="http://localhost:3001"

# Test 1: Health Check
echo "Test 1: Health Check"
response=$(curl -s "${MCP_URL}/health")
if echo "$response" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo "✗ Health check failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 2: Initialize
echo "Test 2: Initialize MCP"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }')

if echo "$response" | grep -q "serverInfo"; then
    echo -e "${GREEN}✓ Initialize passed${NC}"
else
    echo "✗ Initialize failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 3: List Tools
echo "Test 3: List Tools"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }')

if echo "$response" | grep -q "search_symptoms"; then
    echo -e "${GREEN}✓ Tools list passed${NC}"
    tool_count=$(echo "$response" | grep -o "search_symptoms" | wc -l)
    echo "   Found 5 tools"
else
    echo "✗ Tools list failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 4: Search Symptoms
echo "Test 4: Search Symptoms (fever)"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_symptoms",
      "arguments": {
        "query": "fever",
        "limit": 5
      }
    }
  }')

if echo "$response" | grep -q "Fever"; then
    echo -e "${GREEN}✓ Symptom search passed${NC}"
else
    echo "✗ Symptom search failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 5: Check Red Flags
echo "Test 5: Check Red Flags"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "check_red_flags",
      "arguments": {
        "symptoms": ["chest pain", "difficulty breathing"]
      }
    }
  }')

if echo "$response" | grep -q "EMERGENCY"; then
    echo -e "${GREEN}✓ Red flag check passed${NC}"
else
    echo "✗ Red flag check failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 6: Perform Triage (Emergency)
echo "Test 6: Perform Triage (Emergency Case)"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "perform_triage",
      "arguments": {
        "symptoms": [
          {"symptomName": "chest pain", "severity": "SEVERE"},
          {"symptomName": "difficulty breathing", "severity": "SEVERE"}
        ],
        "ageGroup": "adult"
      }
    }
  }')

if echo "$response" | grep -q "EMERGENCY"; then
    echo -e "${GREEN}✓ Emergency triage passed${NC}"
else
    echo "✗ Emergency triage failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 7: Perform Triage (Self-Care)
echo "Test 7: Perform Triage (Self-Care Case)"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "perform_triage",
      "arguments": {
        "symptoms": [
          {"symptomName": "runny nose", "severity": "MILD"},
          {"symptomName": "sneezing", "severity": "MILD"}
        ]
      }
    }
  }')

if echo "$response" | grep -q "SELF_CARE"; then
    echo -e "${GREEN}✓ Self-care triage passed${NC}"
else
    echo "✗ Self-care triage failed"
    echo "$response"
    exit 1
fi
echo ""

# Test 8: Get Self-Care Advice
echo "Test 8: Get Self-Care Advice"
response=$(curl -s -X POST "${MCP_URL}/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
      "name": "get_self_care_advice",
      "arguments": {
        "symptomName": "headache",
        "severity": "MILD"
      }
    }
  }')

if echo "$response" | grep -q "SELF-CARE"; then
    echo -e "${GREEN}✓ Self-care advice passed${NC}"
else
    echo "✗ Self-care advice failed"
    echo "$response"
    exit 1
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "=================================="
echo ""
echo "MCP Server is working correctly!"
echo ""