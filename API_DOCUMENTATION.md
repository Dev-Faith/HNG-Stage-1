# API Documentation - String Analysis API

Base URL: `http://localhost:3000` (development) or `https://your-deployed-url.com` (production)

## Table of Contents

- [Authentication](#authentication)
- [Error Responses](#error-responses)
- [Endpoints](#endpoints)
  - [Create String](#1-create-string)
  - [Get Specific String](#2-get-specific-string)
  - [Get All Strings](#3-get-all-strings)
  - [Natural Language Filter](#4-natural-language-filter)
  - [Delete String](#5-delete-string)

## Authentication

No authentication required for this API.

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Error Type",
  "statusCode": 400
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully (no body returned)
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Invalid data type

## Endpoints

### 1. Create String

Analyzes and stores a new string with computed properties.

**Endpoint:** `POST /strings`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "value": "string to analyze"
}
```

**Field Validation:**

- `value` (required): Must be a string type
- Cannot be empty

**Success Response (201 Created):**

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
  "created_at": "2025-10-22T13:08:01.645Z"
}
```

**Response Fields:**

- `id`: SHA-256 hash of the string (used as unique identifier)
- `value`: Original string value
- `properties`: Computed properties object
  - `length`: Total character count
  - `is_palindrome`: Boolean (case-insensitive check)
  - `unique_characters`: Count of distinct characters
  - `word_count`: Number of whitespace-separated words
  - `sha256_hash`: SHA-256 hash (same as id)
  - `character_frequency_map`: Object with character occurrence counts
- `created_at`: ISO 8601 timestamp

**Error Responses:**

**400 Bad Request** - Missing or invalid "value" field:

```json
{
  "message": "value should not be empty",
  "error": "Bad Request",
  "statusCode": 400
}
```

**409 Conflict** - String already exists:

```json
{
  "message": "String already exists in the system",
  "error": "Conflict",
  "statusCode": 409
}
```

**422 Unprocessable Entity** - Invalid data type:

```json
{
  "message": "Invalid data type for \"value\" (must be string)",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'
```

---

### 2. Get Specific String

Retrieves a previously analyzed string by its value.

**Endpoint:** `GET /strings/{string_value}`

**Path Parameters:**

- `string_value`: The exact string value to retrieve (URL encoded)

**Success Response (200 OK):**

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

**Error Response:**

**404 Not Found** - String doesn't exist:

```json
{
  "message": "String does not exist in the system",
  "error": "Not Found",
  "statusCode": 404
}
```

**Example cURL:**

```bash
# Simple string
curl "http://localhost:3000/strings/racecar"

# String with spaces (URL encoded)
curl "http://localhost:3000/strings/hello%20world"
```

---

### 3. Get All Strings

Retrieves all stored strings with optional filtering.

**Endpoint:** `GET /strings`

**Query Parameters:**

All parameters are optional and can be combined.

| Parameter            | Type    | Description                    | Example           |
| -------------------- | ------- | ------------------------------ | ----------------- |
| `is_palindrome`      | boolean | Filter palindromes             | `true` or `false` |
| `min_length`         | integer | Minimum string length (≥0)     | `5`               |
| `max_length`         | integer | Maximum string length (≥0)     | `20`              |
| `word_count`         | integer | Exact word count (≥0)          | `2`               |
| `contains_character` | string  | Single character to search for | `a`               |

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": {
        "length": 7,
        "is_palindrome": true,
        "unique_characters": 4,
        "word_count": 1,
        "sha256_hash": "hash1",
        "character_frequency_map": { ... }
      },
      "created_at": "2025-10-22T10:00:00.000Z"
    },
    {
      "id": "hash2",
      "value": "level",
      "properties": { ... },
      "created_at": "2025-10-22T10:05:00.000Z"
    }
  ],
  "count": 2,
  "filters_applied": {
    "is_palindrome": true,
    "word_count": 1
  }
}
```

**Response Fields:**

- `data`: Array of string objects
- `count`: Number of results returned
- `filters_applied`: Object showing which filters were applied

**Error Response:**

**400 Bad Request** - Invalid query parameters:

```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Example cURL:**

```bash
# Get all strings
curl "http://localhost:3000/strings"

# Filter palindromes only
curl "http://localhost:3000/strings?is_palindrome=true"

# Multiple filters
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5&word_count=1"

# Filter by character
curl "http://localhost:3000/strings?contains_character=z"

# Length range
curl "http://localhost:3000/strings?min_length=10&max_length=50"
```

---

### 4. Natural Language Filter

Filter strings using natural language queries.

**Endpoint:** `GET /strings/filter-by-natural-language`

**Query Parameters:**

- `query` (required): Natural language query string

**Supported Query Patterns:**

| Pattern                 | Example                                | Parsed Filters                       |
| ----------------------- | -------------------------------------- | ------------------------------------ |
| Single word palindromes | "all single word palindromic strings"  | `word_count=1`, `is_palindrome=true` |
| Longer than             | "strings longer than 10 characters"    | `min_length=11`                      |
| Shorter than            | "strings shorter than 20 characters"   | `max_length=19`                      |
| Containing letter       | "strings containing the letter z"      | `contains_character=z`               |
| First vowel             | "strings that contain the first vowel" | `contains_character=a`               |
| N words                 | "strings with 3 words"                 | `word_count=3`                       |
| Palindromes             | "palindromic strings"                  | `is_palindrome=true`                 |

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-22T10:00:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Response Fields:**

- `data`: Array of matching strings
- `count`: Number of results
- `interpreted_query`: Shows original query and parsed filters
  - `original`: The original query string
  - `parsed_filters`: Object of extracted filter parameters

**Error Responses:**

**400 Bad Request** - Missing query parameter:

```json
{
  "message": "Query parameter \"query\" is required",
  "error": "Bad Request",
  "statusCode": 400
}
```

**400 Bad Request** - Unable to parse query:

```json
{
  "message": "Unable to parse natural language query",
  "error": "Bad Request",
  "statusCode": 400
}
```

**422 Unprocessable Entity** - Conflicting filters:

```json
{
  "message": "Query parsed but resulted in conflicting filters",
  "error": "Unprocessable Entity",
  "statusCode": 422
}
```

**Example cURL:**

```bash
# Single word palindromes
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# Longer than X
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"

# Containing specific letter
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z"

# First vowel
curl "http://localhost:3000/strings/filter-by-natural-language?query=palindromic%20strings%20that%20contain%20the%20first%20vowel"
```

---

### 5. Delete String

Deletes a string from the system.

**Endpoint:** `DELETE /strings/{string_value}`

**Path Parameters:**

- `string_value`: The exact string value to delete (URL encoded)

**Success Response (204 No Content):**

No response body. HTTP status 204 indicates successful deletion.

**Error Response:**

**404 Not Found** - String doesn't exist:

```json
{
  "message": "String does not exist in the system",
  "error": "Not Found",
  "statusCode": 404
}
```

**Example cURL:**

```bash
# Simple string
curl -X DELETE "http://localhost:3000/strings/racecar"

# String with spaces (URL encoded)
curl -X DELETE "http://localhost:3000/strings/hello%20world"
```

---

## Complete Usage Example

Here's a complete workflow demonstrating all endpoints:

```bash
# 1. Create several strings
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'

curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'

curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"madam"}'

# 2. Get all strings
curl "http://localhost:3000/strings"

# 3. Filter palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 4. Get specific string
curl "http://localhost:3000/strings/racecar"

# 5. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# 6. Delete a string
curl -X DELETE "http://localhost:3000/strings/hello%20world"

# 7. Try to create duplicate (will fail with 409)
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'
```

## Data Model

### StringAnalysisEntity

```typescript
{
  id: string;                    // SHA-256 hash
  value: string;                 // Original string
  properties: {
    length: number;              // Character count
    is_palindrome: boolean;      // Case-insensitive check
    unique_characters: number;   // Distinct character count
    word_count: number;          // Words separated by whitespace
    sha256_hash: string;         // Unique identifier
    character_frequency_map: {   // Character occurrence counts
      [character: string]: number;
    }
  };
  created_at: string;            // ISO 8601 timestamp
}
```

## Notes

1. **String Comparison**: The API uses SHA-256 hashing to identify duplicate strings. Two identical strings will have the same hash.

2. **Palindrome Detection**: Case-insensitive. "RaceCar" is considered a palindrome.

3. **Word Counting**: Words are separated by any whitespace characters. Multiple consecutive spaces count as a single separator.

4. **URL Encoding**: Remember to URL encode string values in path parameters (e.g., spaces become `%20`).

5. **Storage**: Currently uses in-memory storage. Data will be lost on server restart. For production, integrate a persistent database.

6. **CORS**: The API has CORS enabled for cross-origin requests.

7. **Validation**: All request data is validated using class-validator. Invalid types or missing required fields will result in 400 errors.
