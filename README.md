# String Analysis API - HNG Stage 1 Backend Task

A RESTful API service built with NestJS that analyzes and stores strings with computed properties including palindrome detection, character frequency analysis, and advanced filtering capabilities.

## 🚀 Features

- **String Analysis**: Automatically computes length, palindrome status, unique characters, word count, SHA-256 hash, and character frequency map
- **CRUD Operations**: Create, read, and delete analyzed strings
- **Advanced Filtering**: Filter strings by multiple criteria (palindrome status, length, word count, character containment)
- **Natural Language Queries**: Support for human-readable filter queries
- **Conflict Detection**: Prevents duplicate strings using SHA-256 hashing
- **Comprehensive Error Handling**: Proper HTTP status codes for all scenarios

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Validation**: class-validator & class-transformer
- **Hashing**: Node.js crypto module

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - For cloning the repository

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd "Stage 1"
```

2. **Install dependencies**

```bash
npm install
```

## 🏃 Running Locally

### Development Mode (with hot-reload)

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Run the compiled application
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 📡 API Endpoints

### 1. Create/Analyze String

**POST** `/strings`

Analyzes a new string and stores it with computed properties.

**Request Body:**

```json
{
  "value": "hello world"
}
```

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
  "created_at": "2025-10-22T10:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request`: Missing "value" field
- `409 Conflict`: String already exists
- `422 Unprocessable Entity`: Invalid data type

### 2. Get Specific String

**GET** `/strings/{string_value}`

Retrieves a previously analyzed string by its value.

**Example:**

```bash
GET /strings/hello%20world
```

**Success Response (200 OK):**

```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": { ... },
  "created_at": "2025-10-22T10:00:00.000Z"
}
```

**Error Response:**

- `404 Not Found`: String does not exist

### 3. Get All Strings with Filtering

**GET** `/strings`

Retrieves all strings with optional query parameter filtering.

**Query Parameters:**

- `is_palindrome` (boolean): Filter palindromes
- `min_length` (integer): Minimum string length
- `max_length` (integer): Maximum string length
- `word_count` (integer): Exact word count
- `contains_character` (string): Single character to search for

**Example:**

```bash
GET /strings?is_palindrome=true&min_length=5&word_count=1
```

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
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "word_count": 1
  }
}
```

**Error Response:**

- `400 Bad Request`: Invalid query parameter types

### 4. Natural Language Filtering

**GET** `/strings/filter-by-natural-language?query={natural_language_query}`

Filter strings using natural language queries.

**Supported Queries:**

- "all single word palindromic strings"
- "strings longer than 10 characters"
- "palindromic strings that contain the first vowel"
- "strings containing the letter z"

**Example:**

```bash
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
```

**Success Response (200 OK):**

```json
{
  "data": [ ... ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Unable to parse query
- `422 Unprocessable Entity`: Conflicting filters

### 5. Delete String

**DELETE** `/strings/{string_value}`

Deletes a string from the system.

**Example:**

```bash
DELETE /strings/hello%20world
```

**Success Response:**

- `204 No Content`: String successfully deleted

**Error Response:**

- `404 Not Found`: String does not exist

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Tests with Coverage

```bash
npm run test:cov
```

### Manual Testing with cURL

**Create a string:**

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'
```

**Get all palindromes:**

```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

**Get a specific string:**

```bash
curl "http://localhost:3000/strings/racecar"
```

**Natural language filter:**

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

**Delete a string:**

```bash
curl -X DELETE "http://localhost:3000/strings/racecar"
```

## 🌐 Deployment

This API can be deployed to various platforms:

### Railway

1. Create a Railway account at [railway.app](https://railway.app/)
2. Connect your GitHub repository
3. Configure build command: `npm run build`
4. Configure start command: `npm run start:prod`
5. Railway will automatically detect Node.js and deploy

### Heroku

1. Create a Heroku account at [heroku.com](https://heroku.com/)
2. Install Heroku CLI
3. Deploy:

```bash
heroku create your-app-name
git push heroku main
```

### AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize EB:

```bash
eb init
eb create
eb deploy
```

### Other Platforms

- **Railway**: Most recommended for easy deployment
- **Fly.io**: Good for global distribution
- **DigitalOcean App Platform**: Simple and affordable
- **AWS Lambda**: Serverless option
- **Google Cloud Run**: Container-based deployment

### Environment Variables

No environment variables are required for basic operation. The application defaults to port 3000, but you can override it:

```bash
PORT=8080 npm run start:prod
```

## 📁 Project Structure

```
Stage 1/
├── src/
│   ├── strings/
│   │   ├── dto/
│   │   │   ├── create-string.dto.ts        # DTO for creating strings
│   │   │   ├── filter-strings.dto.ts       # DTO for filtering
│   │   │   └── natural-language-filter.dto.ts
│   │   ├── entities/
│   │   │   └── string-analysis.entity.ts   # String entity model
│   │   ├── strings.controller.ts           # API endpoints
│   │   ├── strings.service.ts              # Business logic
│   │   └── strings.module.ts               # Module definition
│   ├── app.module.ts                       # Root module
│   ├── app.controller.ts                   # Root controller
│   ├── app.service.ts                      # Root service
│   └── main.ts                             # Application entry point
├── test/                                   # E2E tests
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Key Implementation Details

### String Properties Computation

Each string is analyzed to compute:

1. **Length**: Total character count
2. **Palindrome Check**: Case-insensitive comparison
3. **Unique Characters**: Count of distinct characters
4. **Word Count**: Words separated by whitespace
5. **SHA-256 Hash**: Used as unique identifier
6. **Character Frequency Map**: Occurrence count for each character

### Storage

- In-memory storage using a Map data structure
- Uses SHA-256 hash as the key for O(1) lookups
- Production applications should use a database (PostgreSQL, MongoDB, etc.)

### Natural Language Processing

The API supports parsing natural language queries including:

- Palindrome detection: "palindromic", "palindrome"
- Word count: "single word", "2 words"
- Length comparisons: "longer than X", "shorter than X"
- Character containment: "containing letter X", "first vowel"

## 📝 Dependencies

### Production Dependencies

- `@nestjs/common`: ^11.0.1
- `@nestjs/core`: ^11.0.1
- `@nestjs/platform-express`: ^11.0.1
- `class-validator`: For DTO validation
- `class-transformer`: For DTO transformation
- `reflect-metadata`: ^0.2.2
- `rxjs`: ^7.8.1

### Development Dependencies

- `@nestjs/cli`: ^11.0.0
- `@nestjs/testing`: ^11.0.1
- `typescript`: ^5.7.3
- `ts-jest`: ^29.2.5
- `jest`: ^30.0.0
- `eslint`: ^9.18.0
- `prettier`: ^3.4.2

## 🤝 Contributing

This is a stage 1 task submission for HNG Backend Track. For contributions or issues, please open an issue on the GitHub repository.

## 📞 Support

For questions or support:

- Open an issue on GitHub
- Contact via email
- Join the HNG Slack channel: #stage-1-backend

## 🔗 Links

- **GitHub Repository**: <your-repo-url>
- **HNG Internship**: [https://hng.tech/](https://hng.tech/)
- **Hire Node.js Developers**: [https://hng.tech/hire/nodejs-developers](https://hng.tech/hire/nodejs-developers)

---

Built with ❤️ for HNG Internship Stage 1 Backend Task

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
