# SkillNest Backend Deployment Guide

This guide provides step-by-step instructions for deploying the SkillNest backend server to Render.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account**: Create one at [github.com](https://github.com) if you don't have one
2. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
3. **MongoDB Atlas Account**: Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Git Installed**: Download from [git-scm.com](https://git-scm.com) if needed

## MongoDB Atlas Setup

Before deploying to Render, set up your MongoDB database:

1. **Create a MongoDB Atlas Cluster**:
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com)
   - Click "Build a Database" and select the free tier
   - Choose a cloud provider and region (preferably close to your Render region)
   - Create the cluster (takes 3-5 minutes)

2. **Configure Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and secure password (save these!)
   - Grant "Read and write to any database" privileges

3. **Configure Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Render to connect to your database

4. **Get Connection String**:
   - Go to "Database" and click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name at the end: `mongodb+srv://user:pass@cluster.mongodb.net/skillnest`

## Environment Variables

The following environment variables must be configured in Render:

| Variable | Description | Example Value | Notes |
|----------|-------------|---------------|-------|
| `PORT` | Server port | `10000` | Auto-set by Render, no action needed |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/skillnest` | Get from MongoDB Atlas |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-jwt-key-min-32-chars` | Use a strong random string (32+ characters) |
| `JWT_EXPIRE` | JWT token expiration time | `30d` | Common values: `7d`, `30d`, `90d` |
| `NODE_ENV` | Environment mode | `production` | Already set in render.yaml |
| `ADMIN_SECRET` | Admin authentication secret | `your-admin-secret-key` | Use a strong random string |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `https://your-frontend.vercel.app` | Your deployed frontend URL |

### Generating Secure Secrets

For `JWT_SECRET` and `ADMIN_SECRET`, use strong random strings. You can generate them using:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**OpenSSL:**
```bash
openssl rand -hex 32
```

**Online Generator:**
- Visit [randomkeygen.com](https://randomkeygen.com) and use a "Fort Knox Password"

## Pushing Code to GitHub

If you haven't already pushed your code to GitHub:

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   ```

2. **Add Remote Repository**:
   ```bash
   git remote add origin https://github.com/SankalpMathur05/SkillNest-Smarrtif-Assignment.git
   ```

3. **Stage All Changes**:
   ```bash
   git add .
   ```

4. **Commit Changes**:
   ```bash
   git commit -m "Add Render deployment configuration"
   ```

5. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

   If you encounter authentication issues, you may need to:
   - Use a Personal Access Token instead of password
   - Configure SSH keys for GitHub

## Deploying to Render

### Step 1: Create New Web Service

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click the "New +" button in the top right
3. Select "Web Service"

### Step 2: Connect GitHub Repository

1. If this is your first time, click "Connect GitHub" and authorize Render
2. Search for your repository: `SkillNest-Smarrtif-Assignment`
3. Click "Connect" next to the repository

### Step 3: Configure Service

Render will automatically detect the `render.yaml` file. Verify the following settings:

- **Name**: `skillnest-backend` (auto-filled from render.yaml)
- **Region**: `Oregon (US West)` (auto-filled, can be changed)
- **Branch**: `main`
- **Root Directory**: `./server` (auto-filled from render.yaml)
- **Runtime**: `Node` (auto-detected)
- **Build Command**: `npm install && npm run build` (auto-filled)
- **Start Command**: `npm start` (auto-filled)
- **Plan**: `Free` (auto-filled)

### Step 4: Set Environment Variables

1. Scroll down to the "Environment Variables" section
2. Add each required variable (except `NODE_ENV` and `PORT` which are already set):

   Click "Add Environment Variable" for each:
   
   - **Key**: `MONGO_URI`  
     **Value**: Your MongoDB connection string from Atlas
   
   - **Key**: `JWT_SECRET`  
     **Value**: Your generated secret (32+ characters)
   
   - **Key**: `JWT_EXPIRE`  
     **Value**: `30d`
   
   - **Key**: `ADMIN_SECRET`  
     **Value**: Your generated admin secret
   
   - **Key**: `CLIENT_ORIGIN`  
     **Value**: Your frontend URL (e.g., `https://skillnest-frontend.vercel.app`)

3. Double-check all values are correct (especially `MONGO_URI`)

### Step 5: Deploy

1. Click "Create Web Service" at the bottom
2. Render will start building and deploying your application
3. Watch the deployment logs for any errors
4. The build process takes 2-5 minutes

### Step 6: Verify Deployment

Once deployment is complete:

1. Render will provide a URL like: `https://skillnest-backend.onrender.com`
2. Visit the URL in your browser
3. You should see: `SkillNest API is running...`
4. Check the logs for: `MongoDB Connected Successfully`

## Post-Deployment Configuration

### Update Frontend Configuration

Update your frontend to use the new backend URL:

1. In your frontend `.env` file or environment variables:
   ```
   REACT_APP_API_URL=https://skillnest-backend.onrender.com
   ```

2. Redeploy your frontend

### Update CLIENT_ORIGIN

If you deploy your frontend after the backend:

1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Update `CLIENT_ORIGIN` with your actual frontend URL
4. Render will automatically redeploy with the new value

## Automatic Deployments

Render automatically deploys when you push to GitHub:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Render detects the push and automatically rebuilds/redeploys
4. Monitor the deployment in the Render dashboard

## Monitoring and Logs

### Viewing Logs

1. Go to your service in the Render dashboard
2. Click the "Logs" tab
3. View real-time logs of your application
4. Look for:
   - `MongoDB Connected Successfully` - Database connection OK
   - `Server running in production mode on port 10000` - Server started
   - Any error messages

### Health Checks

Render automatically monitors your service:

- Checks the root endpoint (`/`) every few minutes
- If the service doesn't respond, Render attempts to restart it
- View health check status in the "Events" tab

## Troubleshooting

### Build Fails with TypeScript Errors

**Problem**: Build fails during `npm run build`

**Solution**:
- Check the error logs for specific TypeScript errors
- Fix the errors locally and test with `npm run build`
- Commit and push the fixes

### Server Fails to Start

**Problem**: Build succeeds but server crashes on startup

**Solution**:
1. Check logs for error messages
2. Common causes:
   - Missing environment variables
   - Invalid `MONGO_URI`
   - MongoDB Atlas network access not configured

### MongoDB Connection Failed

**Problem**: Logs show `Error starting server: MongoServerSelectionTimeoutError`

**Solution**:
1. Verify `MONGO_URI` is correct in Render environment variables
2. Check MongoDB Atlas network access allows `0.0.0.0/0`
3. Verify database user credentials are correct
4. Ensure MongoDB cluster is running (not paused)

### CORS Errors from Frontend

**Problem**: Frontend shows CORS errors when making API requests

**Solution**:
1. Verify `CLIENT_ORIGIN` environment variable is set correctly
2. Ensure it matches your frontend URL exactly (including `https://`)
3. Check that `NODE_ENV` is set to `production`
4. Redeploy after updating environment variables

### Service Keeps Restarting

**Problem**: Service restarts repeatedly in Render dashboard

**Solution**:
1. Check logs for crash errors
2. Verify all environment variables are set
3. Test MongoDB connection string locally
4. Ensure no hardcoded values that differ from production

### Free Tier Service Spins Down

**Problem**: First request after inactivity is slow (30+ seconds)

**Explanation**: Render's free tier spins down services after 15 minutes of inactivity

**Solutions**:
- Upgrade to a paid plan for always-on service
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 10 minutes
- Accept the cold start delay for free tier

### Environment Variable Changes Not Applied

**Problem**: Updated environment variables but changes not reflected

**Solution**:
1. After changing environment variables, Render should auto-redeploy
2. If not, manually trigger a deploy:
   - Go to "Manual Deploy" tab
   - Click "Deploy latest commit"
3. Wait for deployment to complete

## Custom Domain (Optional)

To use a custom domain instead of `*.onrender.com`:

1. Go to your service in Render dashboard
2. Click "Settings" tab
3. Scroll to "Custom Domain" section
4. Click "Add Custom Domain"
5. Enter your domain (e.g., `api.skillnest.com`)
6. Follow DNS configuration instructions
7. Add CNAME record to your domain's DNS settings
8. Wait for DNS propagation (up to 48 hours)

## Security Best Practices

1. **Never commit sensitive values**: Keep `.env` files in `.gitignore`
2. **Use strong secrets**: Generate random strings for `JWT_SECRET` and `ADMIN_SECRET`
3. **Rotate secrets periodically**: Update secrets every 90 days
4. **Monitor logs**: Check for suspicious activity or errors
5. **Keep dependencies updated**: Run `npm audit` and update packages regularly
6. **Restrict CORS**: Only allow your frontend domain in `CLIENT_ORIGIN`

## Support and Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Repository**: [github.com/SankalpMathur05/SkillNest-Smarrtif-Assignment](https://github.com/SankalpMathur05/SkillNest-Smarrtif-Assignment)

## Quick Reference Commands

```bash
# Check Git status
git status

# View recent commits
git log --oneline -5

# Pull latest changes
git pull origin main

# Push changes
git add .
git commit -m "Your message"
git push origin main

# View local environment variables
cat server/.env

# Test build locally
cd server
npm install
npm run build
npm start
```

---

**Deployment Checklist**:
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] Network access allows 0.0.0.0/0
- [ ] MongoDB connection string obtained
- [ ] JWT_SECRET and ADMIN_SECRET generated
- [ ] Code pushed to GitHub repository
- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] All environment variables configured in Render
- [ ] Service deployed successfully
- [ ] Health check endpoint returns success
- [ ] MongoDB connection confirmed in logs
- [ ] Frontend updated with backend URL
- [ ] CLIENT_ORIGIN updated with frontend URL

**You're all set!** Your SkillNest backend is now deployed and ready to serve requests.
