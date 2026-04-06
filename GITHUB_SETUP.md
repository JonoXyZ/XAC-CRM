# GitHub Setup Instructions

## Step 1: Install Git (Windows)
1. Download from https://git-scm.com/download/win
2. Run the installer and follow the default options
3. Restart terminal/PowerShell

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `XAC-CRM` (or your preferred name)
3. **Description**: "CRM System for Revival Fitness with WhatsApp Integration"
4. Choose **Public** (or Private if you prefer)
5. **Do NOT initialize with README** (we already have one)
6. Click "Create repository"
7. Copy the repository URL (you'll need it next)

## Step 3: Push Code to GitHub

Open PowerShell in your project folder and run:

```powershell
# Initialize git (first time only)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: XAC CRM with FastAPI backend, React frontend, and Baileys WhatsApp integration"

# Add GitHub as remote (replace URL with your repository URL)
git remote add origin https://github.com/YOUR-USERNAME/XAC-CRM.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Create Environment Variables for Production

After pushing to GitHub:

### Backend (Railway/Render/Heroku)
1. Create `.env.production` with:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/xac_crm_db
   DB_NAME=xac_crm_db
   JWT_SECRET=your-super-secret-key
   CORS_ORIGINS=https://your-frontend-domain.com
   WHATSAPP_SERVICE_URL=http://your-laptop-ip:3001
   ```

### Frontend (Vercel/Netlify)
1. Set environment variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app/api
   REACT_APP_WHATSAPP_SERVICE=http://your-laptop-ip:3001
   ```

## Step 5: Deploy Backend (Railway - Recommended)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitHub"
4. Connect your GitHub account
5. Select `XAC-CRM` repository
6. Railway auto-detects Python
7. Go to Settings → Variables, add:
   - `MONGO_URL`
   - `DB_NAME`
   - `JWT_SECRET`
   - `WHATSAPP_SERVICE_URL`
8. Get your backend URL from the Railway dashboard

## Step 6: Deploy Frontend (Vercel - Recommended)

1. Go to https://vercel.com
2. Click "Export Git Repository"
3. Select your GitHub repository
4. Configure build settings:
   - **Framework**: React
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
5. Add environment variables from Step 4
6. Deploy!

## Useful Git Commands

```powershell
# Check status
git status

# Push new changes
git add .
git commit -m "your commit message"
git push

# View commit history
git log --oneline

# Switch branches
git checkout -b feature-name
git checkout main

# Merge branches
git checkout main
git merge feature-name
git push
```

## Troubleshooting

**Git not found**: Install from https://git-scm.com/download/win

**SSH key issues**: Use HTTPS URLs instead of SSH for simpler setup

**Push fails**: Make sure you have:
- Created the GitHub repository
- Ran `git remote add origin`
- Committed changes with `git commit`

## Next: Separate WhatsApp Service Repository

Create another repository for the WhatsApp/Baileys service:
1. Create `XAC-WhatsApp-Bot` repository
2. Push the whatsapp-service folder there
3. Set up to run 24/7 on your laptop

