# Deployment Guide - String Analysis API

This guide provides step-by-step instructions for deploying your String Analysis API to various platforms.

## Table of Contents

- [Railway (Recommended)](#railway-recommended)
- [Heroku](#heroku)
- [DigitalOcean App Platform](#digitalocean-app-platform)
- [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
- [Fly.io](#flyio)
- [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Railway (Recommended)

Railway is the easiest and fastest way to deploy your NestJS application.

### Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Steps

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy

3. **Configure Build Settings** (if needed)
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`
   - Railway auto-detects these from package.json

4. **Set Environment Variables** (optional)
   - Go to your project settings
   - Add variables (currently none required)

5. **Get Your URL**
   - Railway will generate a public URL
   - Find it in Settings → Domains
   - Example: `https://your-app.up.railway.app`

**Deployment Time**: ~2-3 minutes

---

## Heroku

### Prerequisites

- Heroku account ([signup](https://heroku.com))
- Heroku CLI installed

### Steps

1. **Install Heroku CLI**

   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   heroku create your-app-name
   ```

4. **Deploy**

   ```bash
   git push heroku main
   ```

5. **Check Deployment**
   ```bash
   heroku open
   heroku logs --tail
   ```

**Notes:**

- Heroku uses the `Procfile` included in the project
- Your app URL: `https://your-app-name.herokuapp.com`

---

## DigitalOcean App Platform

### Prerequisites

- DigitalOcean account
- GitHub repository

### Steps

1. **Go to DigitalOcean**
   - Visit [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"

2. **Connect Repository**
   - Choose GitHub
   - Select your repository
   - Select the branch (main/master)

3. **Configure App**
   - **Name**: string-analysis-api
   - **Region**: Choose closest to your users
   - **Plan**: Basic ($5/month)

4. **Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm run start:prod`

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment (~5 minutes)

6. **Get URL**
   - Your app will be at: `https://your-app-name.ondigitalocean.app`

---

## AWS Elastic Beanstalk

### Prerequisites

- AWS account
- AWS CLI and EB CLI installed

### Steps

1. **Install EB CLI**

   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**

   ```bash
   eb init -p node.js your-app-name --region us-east-1
   ```

3. **Create Environment**

   ```bash
   eb create production-env
   ```

4. **Deploy**

   ```bash
   eb deploy
   ```

5. **Open App**

   ```bash
   eb open
   ```

6. **View Logs**
   ```bash
   eb logs
   ```

**Note**: AWS costs vary based on usage.

---

## Fly.io

### Prerequisites

- Fly.io account ([signup](https://fly.io))
- Flyctl CLI

### Steps

1. **Install Flyctl**

   ```bash
   # macOS
   brew install flyctl

   # Or: curl -L https://fly.io/install.sh | sh
   ```

2. **Login**

   ```bash
   flyctl auth login
   ```

3. **Initialize App**

   ```bash
   flyctl launch
   ```

   - App name: your-app-name
   - Region: Choose closest
   - Don't add a database (yet)

4. **Deploy**

   ```bash
   flyctl deploy
   ```

5. **Open App**
   ```bash
   flyctl open
   ```

**Your URL**: `https://your-app-name.fly.dev`

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are in `package.json`
- [ ] `npm run build` works locally
- [ ] `npm run start:prod` works locally
- [ ] No hardcoded localhost URLs
- [ ] Environment variables are documented
- [ ] `.gitignore` excludes node_modules and dist
- [ ] README.md is complete
- [ ] Tests pass (`npm test`)
- [ ] Code is pushed to GitHub

---

## Testing Your Deployed API

Once deployed, test your API:

```bash
# Replace YOUR_DEPLOYED_URL with your actual URL
export API_URL="https://your-app.railway.app"

# Test health
curl $API_URL

# Create a string
curl -X POST $API_URL/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'

# Get all strings
curl "$API_URL/strings"

# Get specific string
curl "$API_URL/strings/hello%20world"

# Filter palindromes
curl "$API_URL/strings?is_palindrome=true"

# Natural language query
curl "$API_URL/strings/filter-by-natural-language?query=palindromic%20strings"

# Delete string
curl -X DELETE "$API_URL/strings/hello%20world"
```

---

## Troubleshooting

### Build Fails

- Check Node.js version matches `engines` in package.json
- Ensure all dependencies are listed
- Check build logs for specific errors

### App Crashes on Start

- Check logs: `heroku logs --tail` or platform equivalent
- Verify start command: `npm run start:prod`
- Ensure port is read from `process.env.PORT`

### 404 Errors

- Verify base URL is correct
- Check CORS is enabled
- Review route paths

### Slow Response

- Check server region (closer is better)
- Consider upgrading plan
- Add caching if needed

---

## Monitoring

After deployment:

1. **Check Logs Regularly**

   ```bash
   # Railway
   railway logs

   # Heroku
   heroku logs --tail

   # Fly.io
   flyctl logs
   ```

2. **Monitor Performance**
   - Use platform dashboards
   - Check response times
   - Monitor error rates

3. **Set Up Alerts**
   - Configure uptime monitoring
   - Set up error notifications
   - Monitor resource usage

---

## Scaling

As your app grows:

- **Vertical Scaling**: Upgrade to larger instance
- **Horizontal Scaling**: Add more instances
- **Add Database**: Replace in-memory storage
- **Add Caching**: Redis for performance
- **CDN**: For static assets

---

## Security Best Practices

- [ ] Use HTTPS (enabled by default on most platforms)
- [ ] Add rate limiting for production
- [ ] Implement authentication if needed
- [ ] Keep dependencies updated
- [ ] Monitor security vulnerabilities

---

## Next Steps

After successful deployment:

1. Test all endpoints thoroughly
2. Share your API URL
3. Monitor logs for errors
4. Gather user feedback
5. Plan database integration for persistence

---

## Support

For deployment issues:

- Check platform documentation
- Review application logs
- Join platform community forums
- Open issues on GitHub

---

## Additional Resources

- [NestJS Deployment Docs](https://docs.nestjs.com/deployment)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Fly.io Documentation](https://fly.io/docs/)
