#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}ShoshaMart Frontend Setup${NC}"
echo -e "${BLUE}==================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

echo -e "${GREEN}✓ npm found: $(npm --version)${NC}\n"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Copy .env.example to .env if not exists
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}==================================${NC}\n"

echo -e "To start the development server, run:"
echo -e "${BLUE}npm run dev${NC}\n"

echo -e "The application will be available at:"
echo -e "${BLUE}http://localhost:3001${NC}\n"
