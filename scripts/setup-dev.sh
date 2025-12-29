#!/bin/bash

# MediTriage Development Setup Script
# This script sets up the local development environment

set -e  # Exit on error

echo "🏥 MediTriage Development Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo ""
echo "🐳 Building and starting Docker containers..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if postgres is healthy
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Waiting for database..."
    sleep 2
done

echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
echo ""

# Run database migrations
echo "📊 Running database migrations..."

# Run init script
echo "   → Running init.sql..."
docker-compose exec -T postgres psql -U postgres -d meditriage -f /docker-entrypoint-initdb.d/01-init.sql > /dev/null 2>&1 || true

# Run migration scripts
echo "   → Loading symptoms..."
docker-compose exec -T postgres psql -U postgres -d meditriage < ./database/migrations/002_seed_symptoms.sql > /dev/null 2>&1

echo "   → Loading conditions..."
docker-compose exec -T postgres psql -U postgres -d meditriage < ./database/migrations/003_seed_conditions.sql > /dev/null 2>&1

echo "   → Loading symptom-condition mappings..."
docker-compose exec -T postgres psql -U postgres -d meditriage < ./database/migrations/004_seed_mappings.sql > /dev/null 2>&1

echo -e "${GREEN}✓ Database migrations completed${NC}"
echo ""

# Verify database
echo "🔍 Verifying database..."
SYMPTOM_COUNT=$(docker-compose exec -T postgres psql -U postgres -d meditriage -t -c "SELECT COUNT(*) FROM symptoms;" | tr -d ' ')
CONDITION_COUNT=$(docker-compose exec -T postgres psql -U postgres -d meditriage -t -c "SELECT COUNT(*) FROM conditions;" | tr -d ' ')
MAPPING_COUNT=$(docker-compose exec -T postgres psql -U postgres -d meditriage -t -c "SELECT COUNT(*) FROM symptom_conditions;" | tr -d ' ')

echo "   Symptoms: $SYMPTOM_COUNT"
echo "   Conditions: $CONDITION_COUNT"
echo "   Mappings: $MAPPING_COUNT"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Install MCP server dependencies
echo "📦 Installing MCP server dependencies..."
cd mcp-server
npm install > /dev/null 2>&1
cd ..
echo -e "${GREEN}✓ MCP server dependencies installed${NC}"
echo ""

# Install RAG service dependencies
echo "📦 Installing RAG service dependencies..."
cd rag-service
python3 -m venv venv > /dev/null 2>&1 || true
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1 || echo "Note: Install Python dependencies manually"
deactivate || true
cd ..
echo -e "${GREEN}✓ RAG service setup complete${NC}"
echo ""

# Success message
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅  Development environment is ready!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "🚀 Next steps:"
echo ""
echo "   1. Start backend:     cd backend && npm run dev"
echo "   2. Start MCP server:  cd mcp-server && npm run dev"
echo "   3. Start RAG service: cd rag-service && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "📍 Service URLs:"
echo "   Backend API:  http://localhost:3000"
echo "   MCP Server:   http://localhost:3001"
echo "   RAG Service:  http://localhost:8000"
echo "   PgAdmin:      http://localhost:5050"
echo ""
echo "🔍 Test the API:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:3000/api/v1/symptoms/search?q=fever"
echo ""