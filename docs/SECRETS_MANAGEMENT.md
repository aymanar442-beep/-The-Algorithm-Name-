# 🔐 Secrets Management Guide

## Overview

This document explains how we handle sensitive information in this project while keeping it public on GitHub.

## Protected Information

### Files That Are NEVER Committed
- `.env` - Local environment variables with your real secrets
- `*.key` - Private keys
- `*.pem` - Certificates
- `secrets/` directory - Any secrets directory
- `credentials.json` - API credentials

### What Gets Committed
- `.env.example` - Template showing which variables are needed
- `SECURITY.md` - Security guidelines
- `.gitignore` - Rules to prevent committing secrets

## Setup Instructions

### 1. Copy the Template
```bash
cp .env.example .env
```

### 2. Fill in Your Secrets
Edit `.env` and replace placeholder values with your actual credentials:
```bash
# Before (from .env.example)
GEMINI_API_KEY=your_gemini_api_key_here

# After (in your .env file)
GEMINI_API_KEY=sk-proj-abc123xyz...
```

### 3. Verify It's Protected
Check that `.env` appears in `.gitignore`:
```bash
grep -E '^\.env' .gitignore
```

### 4. Never Commit .env
```bash
# This will NOT commit your .env file
git add .
git commit -m "Your changes"
git push
```

## What If I Accidentally Committed a Secret?

### Immediate Actions
1. **Rotate the secret immediately** (change password, regenerate token, etc.)
2. **Remove it from Git history**
3. **Notify your team**

### Remove from History
```bash
# Option 1: Remove the file completely
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from tracking"
git push

# Option 2: Use BFG Repo-Cleaner (more thorough)
bfg --replace-text passwords.txt
git push --force-with-lease
```

## GitHub Protection Features

This repository has:
- ✅ Secret scanning enabled
- ✅ Push protection (blocks commits with secrets)
- ✅ Automated alerts for leaked credentials

## For Team Members

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Ask project maintainer for actual secret values
4. Add them to your `.env` file
5. **NEVER commit your .env file**

## Best Practices

✅ **DO:**
- Use `.env.example` for configuration templates
- Use environment variables for all secrets
- Rotate secrets regularly
- Document which secrets are needed (in `.env.example`)
- Use GitHub Secrets for CI/CD pipelines

❌ **DON'T:**
- Commit `.env` files
- Hardcode secrets in code
- Share `.env` files via email or chat
- Use the same secrets across environments
- Commit API keys, passwords, or tokens

## GitHub Actions Secrets

For CI/CD pipelines, use GitHub Secrets:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run deploy
```

Configure secrets in: **Settings → Secrets and variables → Actions**

## Further Reading

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Keeping your API keys safe](https://12factor.net/config)
- [OWASP Secrets Management](https://owasp.org/www-community/Secret_Management)
