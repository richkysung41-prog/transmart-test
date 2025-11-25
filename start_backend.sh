#!/bin/bash

# Transmart Backend Setup Script
# This script sets up the backend for local development

echo "================================"
echo "Transmart Backend Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "config/config.php" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Checking PHP installation...${NC}"
if ! command -v php &> /dev/null; then
    echo -e "${RED}PHP is not installed${NC}"
    exit 1
fi
PHP_VERSION=$(php -v | head -n 1)
echo -e "${GREEN}✓ $PHP_VERSION${NC}"
echo ""

echo -e "${YELLOW}2. Creating required directories...${NC}"
mkdir -p assets/uploads
mkdir -p logs
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

echo -e "${YELLOW}3. Setting directory permissions...${NC}"
chmod 755 assets/uploads
chmod 755 logs
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${YELLOW}4. Testing database connection...${NC}"
php test_database.php
DB_TEST=$?
if [ $DB_TEST -ne 0 ]; then
    echo -e "${RED}Database connection failed${NC}"
    echo "Please check your database configuration in config/database.php"
    exit 1
fi
echo ""

echo -e "${YELLOW}5. Starting PHP development server...${NC}"
echo -e "${GREEN}✓ Server running at http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start PHP server
cd "$(dirname "$0")"
php -S localhost:8000

