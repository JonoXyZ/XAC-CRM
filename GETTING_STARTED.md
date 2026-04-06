# 🚀 Getting Started - XAC CRM Migration from Emergent

## What Changed

Your project has been reconfigured to work independently without Emergent infrastructure. Here's what was updated:

### ✅ Removed Emergent Dependencies
- Removed `EMERGENT_LLM_KEY` from configuration
- Changed deployment from Emergent to standard cloud platforms
- Updated all URLs to use independent services

### 📝 Updated Configuration Files

1. **backend/.env** - Now supports MongoDB Atlas + Railway deployment
2. **frontend/.env** - Updated to use independent backend URL
3. **docker-compose.yml** - Added for local development (new)
4. **Dockerfile** files - Added for backend, frontend, WhatsApp service (new)

### 📚 New Documentation Files

- **DEPLOYMENT.md** - Complete deployment guide
- **GITHUB_SETUP.md** - Step-by-step GitHub setup
- **WHATSAPP_SERVICE_SETUP.md** - WhatsApp service detailed guide
- **README.md** - Updated with new architecture
- **.env.example** - Template for backend configuration

---

## 🎯 Your Next Steps (In Order)

### Phase 1: Setup (Today)
1. Install Git (if not already installed)
2. Create GitHub repository
3. Push code to GitHub

### Phase 2: Infrastructure (This Week)
4. Create MongoDB Atlas cluster
5. Deploy backend to Railway
6. Deploy frontend to Vercel

### Phase 3: WhatsApp Service (Whenever)
7. Create separate WhatsApp repository
8. Set up on always-on laptop
9. Connect to backend

---

## Quick Start

### 1️⃣ Install Git (Windows)
```powershell
# Download and install from:
# https://git-scm.com/download/win

# Verify installation
git --version
```

### 2️⃣ Initialize Local Repository
```powershell
# Navigate to project folder
cd "c:\Users\User\Desktop\XAC\XAC CRM\archive"

# Initialize git
git init

# Configure git (one time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: XAC CRM migration from Emergent"
```

### 3️⃣ Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `XAC-CRM`
3. Description: "CRM for Revival Fitness with WhatsApp Integration"
4. Choose **Public** or **Private**
5. **Don't** initialize with README (we have one)
6. Click "Create repository"
7. Copy the URL (looks like: `https://github.com/username/XAC-CRM.git`)

### 4️⃣ Push to GitHub
```powershell
# Add GitHub as remote
git remote add origin https://github.com/YOUR-USERNAME/XAC-CRM.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

### ✅ Done! Your code is now on GitHub

---

## 🗄️ MongoDB Atlas Setup

### Create Free Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account or sign in
3. Create new project (name: "XAC-CRM")
4. Create free cluster (M0 - free tier)
5. Choose region closest to you
6. Wait for cluster creation (~5 min)

### Get Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers"
3. Select "Python" driver
4. Copy connection string
5. Replace `<password>` with your password
6. Replace `myFirstDatabase` with `xac_crm_db`

Example:
```
mongodb+srv://username:password@cluster-name.mongodb.net/xac_crm_db?retryWrites=true&w=majority
```

---

## 🚀 Deploy Backend (Railway)

### Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (easiest)
3. Authorize Railway

### Deploy
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select `XAC-CRM` repository
5. Railway auto-detects Python
6. Wait for deployment (~2 min)

### Configure Environment Variables
1. Go to project in Railway dashboard
2. Click "Variables" tab
3. Add these variables:
   ```
   MONGO_URL=mongodb+srv://...  # Your MongoDB connection string
   DB_NAME=xac_crm_db
   JWT_SECRET=your-super-secret-key-change-this
   WHATSAPP_SERVICE_URL=http://your-laptop-ip:3001
   CORS_ORIGINS=https://your-vercel-frontend.vercel.app
   ```

### Get Backend URL
1. In Railway dashboard, find your project
2. Look for "https://your-backend.railway.app"
3. Add `/api` when needed: `https://your-backend.railway.app/api`

---

## 🎨 Deploy Frontend (Vercel)

### Setup Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your `XAC-CRM` repository
5. Configure:
   - Framework: React
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
6. Add Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend.railway.app/api
   REACT_APP_WHATSAPP_SERVICE=http://your-laptop-ip:3001
   ```
7. Click "Deploy"

### Get Frontend URL
- After deployment, you'll get a URL like: `https://xac-crm.vercel.app`
- This is your production frontend!

---

## 📱 WhatsApp Service (Separate Repository)

### Create Repository
1. Go to https://github.com/new
2. Repository name: `XAC-WhatsApp-Bot`
3. Description: "WhatsApp Bot for XAC CRM using Baileys"
4. Create repository

### Setup Service
```powershell
# Create separate folder for WhatsApp service
mkdir XAC-WhatsApp-Bot
cd XAC-WhatsApp-Bot

# Copy whatsapp-service folder contents from your archive
# Then initialize git:
git init
git add .
git commit -m "WhatsApp bot with Baileys"
git remote add origin https://github.com/your-username/XAC-WhatsApp-Bot.git
git push -u origin main
```

### Run Locally
```bash
npm install
node index.js
```

First run will show QR code in terminal. Scan with WhatsApp!

### Expose to Internet
Use **ngrok** (easiest):
```bash
# Install from https://ngrok.com
# Run:
ngrok http 3001

# Copy ngrok URL (e.g., https://abc123.ngrok.io)
# Add to backend WHATSAPP_SERVICE_URL
```

---

## ✨ Test Everything

### Local Testing
```bash
# Terminal 1: MongoDB (Docker)
docker run -d -p 27017:27017 mongo

# Terminal 2: Backend
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn server:app --reload

# Terminal 3: WhatsApp Service
cd whatsapp-service
npm install
node index.js

# Terminal 4: Frontend
cd frontend
npm install
npm start

# Then open http://localhost:3000
```

### Production Testing
1. Go to `https://your-frontend.vercel.app`
2. Try logging in
3. Test WhatsApp connection (should scan QR code)
4. Create a test lead
5. Send notification via WhatsApp

---

## 🆘 Troubleshooting

### Problem: QR Code Not Showing
**Solution**: 
- Check if `WHATSAPP_SERVICE_URL` is correct in backend
- Make sure WhatsApp service is running and accessible
- Use ngrok if service is on local laptop

### Problem: Backend Can't Reach MongoDB
**Solution**:
- Copy MongoDB connection string correctly
- Check whitelist IP in Atlas (should be 0.0.0.0/0 for development)
- Verify `DB_NAME=xac_crm_db` in configuration

### Problem: CORS Errors
**Solution**:
- Add frontend URL to `CORS_ORIGINS` in backend
- Example: `https://xac-crm.vercel.app`

### Problem: Git Command Not Found
**Solution**:
- Install Git from https://git-scm.com/download/win
- Restart PowerShell
- Verify: `git --version`

---

## 📞 Useful Documentation Files

- **DEPLOYMENT.md** - Detailed deployment guide for all platforms
- **WHATSAPP_SERVICE_SETUP.md** - WhatsApp service details
- **GITHUB_SETUP.md** - Git & GitHub commands
- **README.md** - Project overview

---

## 🎓 Learning Resources

- **Git**: https://git-scm.com/doc
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **MongoDB**: https://docs.mongodb.com/
- **Railway**: https://docs.railway.app/
- **Vercel**: https://vercel.com/docs
- **Baileys**: https://github.com/WhiskeySockets/Baileys

---

## ✅ Checklist

```
Setup:
□ Install Git
□ Create GitHub repository
□ Push code to GitHub

Infrastructure:
□ Create MongoDB Atlas cluster
□ Get MongoDB connection string
□ Deploy backend to Railway
□ Get backend URL
□ Deploy frontend to Vercel
□ Get frontend URL

WhatsApp:
□ Create WhatsApp repository
□ Set up local WhatsApp service
□ Expose with ngrok
□ Test QR code scanning
□ Verify notifications work

Final:
□ Update credentials in production
□ Test full workflow
□ Set up 24/7 WhatsApp service on laptop
□ Celebrate! 🎉
```

---

## 🤔 Questions?

Check these files first:
1. **DEPLOYMENT.md** - For deployment questions
2. **WHATSAPP_SERVICE_SETUP.md** - For WhatsApp issues
3. **README.md** - For project overview
4. **GITHUB_SETUP.md** - For Git commands

Good luck! 🚀
