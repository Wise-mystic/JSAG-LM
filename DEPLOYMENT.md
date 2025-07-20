# 🚀 Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas cluster
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Set up MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier works fine)
3. Create a database user with read/write permissions
4. Get your connection string

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the following settings:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty (not needed)
   - **Output Directory**: Leave empty (not needed)
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and set up environment variables
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
```

### Environment Variables Explained:

- **MONGODB_URI**: Your MongoDB Atlas connection string
- **SESSION_SECRET**: A random string for session security (use a strong random string)
- **NODE_ENV**: Set to "production" for Vercel

## Step 4: Deploy

1. Commit and push your changes to GitHub
2. Vercel will automatically redeploy
3. Your app will be available at `https://your-project-name.vercel.app`

## Troubleshooting

### Common Issues:

1. **404 Error**: Make sure `vercel.json` is in your root directory
2. **MongoDB Connection Error**: Check your `MONGODB_URI` environment variable
3. **Session Issues**: Ensure `SESSION_SECRET` is set
4. **Build Failures**: Check that all dependencies are in `package.json`

### Debugging:

1. Check Vercel deployment logs in the dashboard
2. Verify environment variables are set correctly
3. Test MongoDB connection locally first

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your local MongoDB URI

# Run development server
npm run dev
```

## Production Considerations

1. **MongoDB Atlas**: Use a production cluster, not free tier
2. **Session Storage**: Consider using Redis for session storage in production
3. **Security**: Use strong, unique session secrets
4. **Monitoring**: Set up Vercel analytics and monitoring

## Support

If you encounter issues:

1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Test the application locally first
4. Check MongoDB Atlas connection and permissions 