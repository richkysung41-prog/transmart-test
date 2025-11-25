#!/bin/bash

# Transmart API Testing Script using cURL
# Test all API endpoints

BASE_URL="http://localhost:8000"
COOKIE_JAR="/tmp/transmart_cookies.txt"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counter
PASSED=0
FAILED=0

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Transmart API Testing${NC}"
echo -e "${BLUE}================================${NC}\n"

# Function to test API
test_api() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo -e "${YELLOW}Testing: $name${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -b $COOKIE_JAR \
            "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -b $COOKIE_JAR -c $COOKIE_JAR \
            -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -b $COOKIE_JAR \
            -X PUT \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    # Extract status and body
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED (Status: $status)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED (Expected: $expected_status, Got: $status)${NC}"
        echo "Response: $body"
        ((FAILED++))
    fi
    echo ""
}

# 1. Test Registration
echo -e "${BLUE}=== Authentication Tests ===${NC}\n"

test_api "Register" "POST" \
    "/api/auth.php?action=register" \
    '{"name":"Test User","email":"test@example.com","password":"password123","phone":"081234567890"}' \
    "201"

# 2. Test Login
test_api "Login" "POST" \
    "/api/auth.php?action=login" \
    '{"email":"budi@example.com","password":"password123"}' \
    "200"

# 3. Test Get Products
echo -e "${BLUE}=== Product Tests ===${NC}\n"

test_api "Get All Products" "GET" \
    "/api/products.php?action=get_all&page=1&limit=12" \
    "" \
    "200"

# 4. Test Get Product Detail
test_api "Get Product Detail" "GET" \
    "/api/products.php?action=detail&id=1" \
    "" \
    "200"

# 5. Test Get Categories
echo -e "${BLUE}=== Category Tests ===${NC}\n"

test_api "Get Categories" "GET" \
    "/api/categories.php?action=get_all" \
    "" \
    "200"

# 6. Test Homepage
echo -e "${BLUE}=== Homepage Tests ===${NC}\n"

test_api "Get Homepage Data" "GET" \
    "/api/homepage.php?section=all" \
    "" \
    "200"

# 7. Test Cart Operations
echo -e "${BLUE}=== Cart Tests ===${NC}\n"

test_api "Get Cart" "GET" \
    "/api/cart.php?action=get&user_id=2" \
    "" \
    "200"

test_api "Add to Cart" "POST" \
    "/api/cart.php?action=add" \
    '{"user_id":2,"product_id":1,"quantity":2}' \
    "200"

# 8. Test Search
echo -e "${BLUE}=== Search Tests ===${NC}\n"

test_api "Search Products" "GET" \
    "/api/products.php?action=search&keyword=headphone" \
    "" \
    "200"

# 9. Summary
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}Total: $((PASSED + FAILED))${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the output above.${NC}"
    exit 1
fi
