# 🚀 Vercel Deployment Guide

## Overview

This is a Node.js Express application optimized for Vercel deployment using their serverless functions architecture.

## Project Structure

```
├── api/
│   ├── index.js          # Main API handler (Vercel entry point)
│   └── test.js           # Test endpoint
├── controllers/          # Business logic
├── models/              # Database models
├── routes/              # API routes
├── middleware/          # Custom middleware
├── public/              # Static files (HTML, CSS, JS)
├── utils/               # Utility functions
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## Deployment Steps

### 1. Prerequisites

- [Vercel Account](https://vercel.com)
- [MongoDB Atlas Account](https://mongodb.com/atlas)
- [GitHub Repository](https://github.com)

### 2. Set up MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Get your connection string
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts to configure
```

### 4. Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
```

### 5. Test Deployment

After deployment, test these endpoints:

- **Home**: `https://your-app.vercel.app/`
- **Login**: `https://your-app.vercel.app/login`
- **Register**: `https://your-app.vercel.app/register`
- **Dashboard**: `https://your-app.vercel.app/dashboard`
- **API Test**: `https://your-app.vercel.app/api/test`

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp config.env.example config.env
# Edit config.env with your local settings

# Run development server
npm run dev

# Or run production mode
npm start
```

## Vercel Configuration

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 30
    }
  }
}
```

### Key Features

- **Serverless Functions**: All routes handled by `api/index.js`
- **Static File Serving**: HTML files served from `public/` directory
- **Session Management**: MongoDB-backed sessions
- **Database Integration**: Mongoose ODM with MongoDB Atlas
- **Error Handling**: Comprehensive error handling and logging

## Troubleshooting

### Common Issues

1. **404 Errors**
   - Check that `vercel.json` is in the root directory
   - Verify `api/index.js` exists and exports the app
   - Check Vercel deployment logs

2. **MongoDB Connection Issues**
   - Verify `MONGODB_URI` environment variable is set
   - Check MongoDB Atlas network access settings
   - Ensure database user has correct permissions

3. **Session Issues**
   - Verify `SESSION_SECRET` is set
   - Check MongoDB connection for session storage
   - Clear browser cookies if testing locally

4. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check Vercel build logs

### Debugging

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - View function logs for errors

2. **Test API Endpoints**
   - Use the test endpoint: `/api/test`
   - Check response for environment info

3. **Verify Environment Variables**
   - Check Vercel dashboard settings
   - Ensure variables are set for production

## Production Considerations

1. **MongoDB Atlas**
   - Use a production cluster, not free tier
   - Set up proper network security
   - Monitor database performance

2. **Security**
   - Use strong session secrets
   - Enable HTTPS (automatic with Vercel)
   - Set up proper CORS if needed

3. **Performance**
   - Monitor function execution times
   - Consider caching strategies
   - Optimize database queries

4. **Monitoring**
   - Set up Vercel analytics
   - Monitor error rates
   - Set up alerts for downtime

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas status
5. Review Vercel documentation

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com) 