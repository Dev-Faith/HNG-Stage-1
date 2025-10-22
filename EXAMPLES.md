# Example API Requests & Responses

This file contains real-world examples of API requests and responses for testing and reference.

## 1. Creating Strings

### Example 1.1: Create a Palindrome

**Request:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'
```

**Response (201 Created):**

```json
{
  "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "2025-10-22T13:08:01.645Z"
}
```

### Example 1.2: Create a Multi-Word String

**Request:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'
```

**Response (201 Created):**

```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T13:08:27.626Z"
}
```

### Example 1.3: Create Duplicate (Error)

**Request:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'
```

**Response (409 Conflict):**

```json
{
  "message": "String already exists in the system",
  "error": "Conflict",
  "statusCode": 409
}
```

### Example 1.4: Missing Value (Error)

**Request:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (400 Bad Request):**

```json
{
  "message": ["value should not be empty", "value must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 2. Getting Specific Strings

### Example 2.1: Get Existing String

**Request:**

```bash
curl "http://localhost:3000/strings/racecar"
```

**Response (200 OK):**

```json
{
  "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "2025-10-22T13:08:01.645Z"
}
```

### Example 2.2: Get String with Spaces

**Request:**

```bash
curl "http://localhost:3000/strings/hello%20world"
```

**Response (200 OK):**

```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      " ": 1,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T13:08:27.626Z"
}
```

### Example 2.3: Get Non-Existent String (Error)

**Request:**

```bash
curl "http://localhost:3000/strings/nonexistent"
```

**Response (404 Not Found):**

```json
{
  "message": "String does not exist in the system",
  "error": "Not Found",
  "statusCode": 404
}
```

## 3. Filtering Strings

### Example 3.1: Get All Strings (No Filters)

**Request:**

```bash
curl "http://localhost:3000/strings"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-22T13:08:01.645Z"
    },
    {
      "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      "value": "hello world",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
        "character_frequency_map": {
          "h": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          " ": 1,
          "w": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2025-10-22T13:08:27.626Z"
    }
  ],
  "count": 2,
  "filters_applied": {}
}
```

### Example 3.2: Filter by Palindrome

**Request:**

```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-22T13:08:01.645Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true
  }
}
```

### Example 3.3: Multiple Filters

**Request:**

```bash
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5&word_count=1"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-22T13:08:01.645Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "word_count": 1
  }
}
```

### Example 3.4: Filter by Character

**Request:**

```bash
curl "http://localhost:3000/strings?contains_character=w"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      "value": "hello world",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
        "character_frequency_map": {
          "h": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          " ": 1,
          "w": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2025-10-22T13:08:27.626Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "contains_character": "w"
  }
}
```

## 4. Natural Language Queries

### Example 4.1: Single Word Palindromes

**Request:**

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-22T13:08:01.645Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "is_palindrome": true,
      "word_count": 1
    }
  }
}
```

### Example 4.2: Strings Longer Than X

**Request:**

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      "value": "hello world",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
        "character_frequency_map": {
          "h": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          " ": 1,
          "w": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2025-10-22T13:08:27.626Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "strings longer than 10 characters",
    "parsed_filters": {
      "min_length": 11
    }
  }
}
```

### Example 4.3: Containing Specific Letter

**Request:**

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20r"
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "e00f9ef51a95f6e854862eed28dc0f1a68f154d9f75ddd841ab00de6ede9209b",
        "character_frequency_map": {
          "r": 2,
          "a": 2,
          "c": 2,
          "e": 1
        }
      },
      "created_at": "2025-10-22T13:08:01.645Z"
    },
    {
      "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      "value": "hello world",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
        "character_frequency_map": {
          "h": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          " ": 1,
          "w": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2025-10-22T13:08:27.626Z"
    }
  ],
  "count": 2,
  "interpreted_query": {
    "original": "strings containing the letter r",
    "parsed_filters": {
      "contains_character": "r"
    }
  }
}
```

### Example 4.4: Unparseable Query (Error)

**Request:**

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=gibberish%20nonsense"
```

**Response (400 Bad Request):**

```json
{
  "message": "Unable to parse natural language query",
  "error": "Bad Request",
  "statusCode": 400
}
```

## 5. Deleting Strings

### Example 5.1: Delete Existing String

**Request:**

```bash
curl -X DELETE "http://localhost:3000/strings/hello%20world" -w "\nStatus: %{http_code}\n"
```

**Response (204 No Content):**

```
Status: 204
```

(No body returned)

### Example 5.2: Delete Non-Existent String (Error)

**Request:**

```bash
curl -X DELETE "http://localhost:3000/strings/nonexistent"
```

**Response (404 Not Found):**

```json
{
  "message": "String does not exist in the system",
  "error": "Not Found",
  "statusCode": 404
}
```

## Testing Workflow

Here's a complete workflow you can run to test all functionality:

```bash
# 1. Create test strings
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value":"racecar"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value":"level"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value":"hello world"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value":"madam"}'

# 2. Get all strings
curl "http://localhost:3000/strings"

# 3. Filter for palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 4. Get specific string
curl "http://localhost:3000/strings/racecar"

# 5. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# 6. Try duplicate (should fail)
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value":"racecar"}'

# 7. Delete string
curl -X DELETE "http://localhost:3000/strings/hello%20world"

# 8. Verify deletion
curl "http://localhost:3000/strings/hello%20world"
```

## Notes

- All timestamps are in ISO 8601 format
- SHA-256 hashes are 64 characters long (hex)
- Spaces in URLs must be encoded as `%20`
- All responses use proper HTTP status codes
- Character frequency maps include all characters (including spaces)
- Palindrome checks are case-insensitive
