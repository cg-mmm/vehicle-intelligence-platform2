# Deployment Guide

## Overview

This application publishes articles to GitHub and can be deployed to Vercel for production use.

## How It Works

1. **Generate Articles**: Use the `/admin/generate` page to create articles with OpenAI
2. **Publish to GitHub**: Articles are saved to `content/articles/[slug].json` in your GitHub repository
3. **Deploy to Vercel**: Vercel reads articles from GitHub and serves them at `/articles/[slug]`

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your Vercel project:

\`\`\`bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...  # Your OpenAI API key

# GitHub Configuration (for publishing)
GITHUB_TOKEN=ghp_...         # GitHub Personal Access Token with repo access
GITHUB_OWNER=your-username   # Your GitHub username
GITHUB_REPO=v0-automata-2    # Your repository name
GITHUB_BRANCH=main           # Branch to publish to (default: main)
\`\`\`

### 2. GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Vercel Automata Publishing"
4. Select scopes: `repo` (full control of private repositories)
5. Generate token and copy it
6. Add it to Vercel as `GITHUB_TOKEN`

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the environment variables listed above
4. Deploy

### 4. Testing Locally

To test locally with GitHub integration:

\`\`\`bash
# Add environment variables to .env.local
OPENAI_API_KEY=sk-proj-...
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-username
GITHUB_REPO=v0-automata-2
GITHUB_BRANCH=main

# Run the development server
npm run dev
\`\`\`

## Publishing Workflow

1. **Generate**: Go to `/admin/generate` and create an article
2. **Publish**: Click "Publish Article" to save to GitHub
3. **Deploy**: Vercel automatically deploys when you push to GitHub
4. **View**: Article is available at `/articles/[slug]`

## Troubleshooting

### Article Not Found (404)

If you see a 404 error after publishing:

1. **Check GitHub**: Verify the article was saved to `content/articles/[slug].json` in your repo
2. **Check Environment Variables**: Ensure `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO` are set correctly
3. **Redeploy**: Trigger a new deployment in Vercel to pick up the new article
4. **Cache**: Wait 60 seconds for the cache to refresh (articles are cached for 60 seconds)

### Publishing Fails

If publishing to GitHub fails:

1. **Check Token**: Ensure your `GITHUB_TOKEN` has `repo` scope
2. **Check Repository**: Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
3. **Check Branch**: Ensure `GITHUB_BRANCH` exists (default is `main`)

### OpenAI Generation Fails

If article generation fails:

1. **Check API Key**: Verify `OPENAI_API_KEY` is valid
2. **Check Credits**: Ensure you have OpenAI credits available
3. **Check Logs**: Look at the console logs for specific error messages

## Local Development vs Production

- **Local Development**: Articles are stored in memory and lost when the server restarts
- **Production (Vercel)**: Articles are loaded from GitHub and cached for 60 seconds

To test the full workflow locally, you need to set up the GitHub environment variables.
