#!/bin/bash

# Test Script for String Analysis API
# Usage: ./test-api.sh [base_url]
# Example: ./test-api.sh http://localhost:3000

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (default to localhost)
BASE_URL="${1:-http://localhost:3000}"

echo -e "${YELLOW}Testing String Analysis API at: $BASE_URL${NC}\n"

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        ((FAILED++))
    fi
    
    echo "Response: $body"
}

# Run tests
echo -e "${YELLOW}=== Starting API Tests ===${NC}\n"

# Test 1: Health check
test_endpoint "Health Check" "GET" "/" "" "200"

# Test 2: Create a string (palindrome)
test_endpoint "Create palindrome string" "POST" "/strings" '{"value":"racecar"}' "201"

# Test 3: Create another string
test_endpoint "Create non-palindrome string" "POST" "/strings" '{"value":"hello world"}' "201"

# Test 4: Try to create duplicate
test_endpoint "Create duplicate (should fail)" "POST" "/strings" '{"value":"racecar"}' "409"

# Test 5: Create string with missing value
test_endpoint "Create with missing value (should fail)" "POST" "/strings" '{}' "400"

# Test 6: Get specific string
test_endpoint "Get specific string" "GET" "/strings/racecar" "" "200"

# Test 7: Get non-existent string
test_endpoint "Get non-existent string (should fail)" "GET" "/strings/nonexistent" "" "404"

# Test 8: Get all strings
test_endpoint "Get all strings" "GET" "/strings" "" "200"

# Test 9: Filter by palindrome
test_endpoint "Filter palindromes" "GET" "/strings?is_palindrome=true" "" "200"

# Test 10: Filter by word count
test_endpoint "Filter by word count" "GET" "/strings?word_count=1" "" "200"

# Test 11: Natural language query
test_endpoint "Natural language query" "GET" "/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings" "" "200"

# Test 12: Delete string
test_endpoint "Delete string" "DELETE" "/strings/hello%20world" "" "204"

# Test 13: Delete non-existent string
test_endpoint "Delete non-existent string (should fail)" "DELETE" "/strings/nonexistent" "" "404"

# Summary
echo -e "\n${YELLOW}=== Test Summary ===${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed! 🎉${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed! ❌${NC}"
    exit 1
fi
