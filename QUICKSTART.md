# Quick Start Guide - String Analysis API

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git installed

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "Stage 1"

# 2. Install dependencies
npm install

# 3. Start the server
npm run start:dev
```

The API will be running at `http://localhost:3000`

## Quick Test

Open a new terminal and run these commands:

```bash
# Create a palindrome string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"racecar"}'

# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"
```

You should see JSON responses with analyzed string data!

## What's Next?

1. **Read the Full Documentation**: Check `API_DOCUMENTATION.md`
2. **Run Tests**: `npm test`
3. **Deploy**: Follow `DEPLOYMENT.md` guide
4. **Explore**: Try all 5 endpoints

## Available Endpoints

| Method | Endpoint                              | Description             |
| ------ | ------------------------------------- | ----------------------- |
| POST   | `/strings`                            | Create/analyze a string |
| GET    | `/strings/:value`                     | Get specific string     |
| GET    | `/strings`                            | Get all (with filters)  |
| GET    | `/strings/filter-by-natural-language` | Natural language search |
| DELETE | `/strings/:value`                     | Delete a string         |

## Common Commands

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Check for errors
npm run lint
```

## Testing with the Test Script

```bash
# Run automated tests
./test-api.sh http://localhost:3000
```

## Example Requests

### 1. Create a String

```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'
```

### 2. Get a String

```bash
curl "http://localhost:3000/strings/hello%20world"
```

### 3. Filter Strings

```bash
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1"
```

### 4. Natural Language Query

```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=palindromic%20strings"
```

### 5. Delete a String

```bash
curl -X DELETE "http://localhost:3000/strings/hello%20world"
```

## Troubleshooting

**Port already in use?**

```bash
# Use a different port
PORT=8080 npm run start:dev
```

**Dependencies not installing?**

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**

```bash
# Make sure no other instance is running
pkill -f "nest start"
npm test
```

## Project Structure

```
Stage 1/
├── src/
│   ├── strings/          # Strings module
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entities/     # Entity definitions
│   │   ├── *.controller.ts
│   │   ├── *.service.ts
│   │   └── *.module.ts
│   ├── app.module.ts     # Root module
│   └── main.ts           # Entry point
├── test/                 # E2E tests
├── README.md             # Main documentation
├── API_DOCUMENTATION.md  # API docs
├── DEPLOYMENT.md         # Deployment guide
└── package.json
```

## Need Help?

- **Full API Docs**: See `API_DOCUMENTATION.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Main README**: See `README.md`
- **Issues**: Open an issue on GitHub

## HNG Submission

When ready to submit:

1. Deploy your API (Railway recommended)
2. Test all endpoints on deployed URL
3. Go to `#stage-1-backend` in Slack
4. Run `/stage-one-backend` command
5. Submit:
   - Your API base URL
   - Your GitHub repo link
   - Your full name
   - Your email
   - Stack (NestJS)

---

Happy coding! 🎉
