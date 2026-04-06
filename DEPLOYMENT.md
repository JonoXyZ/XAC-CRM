# XAC CRM Deployment Guide

## Architecture
- **Frontend**: React app (Vercel/Netlify/GitHub Pages)
- **Backend**: FastAPI (Railway/Render/Heroku)
- **Database**: MongoDB Atlas (cloud)
- **WhatsApp Service**: Node.js Baileys on always-on laptop (separate repo)

## Setup Instructions

### 1. MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster-name.mongodb.net/xac_crm_db`
4. Copy this to `.env` as `MONGO_URL`

### 2. Backend Deployment (Railway/Render/Heroku)

#### Option A: Railway (Recommended)
1. Go to https://railway.app and connect your GitHub
2. Create new project from this repo
3. Add these environment variables:
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=xac_crm_db
   JWT_SECRET=your-secret-key-here
   WHATSAPP_SERVICE_URL=http://your-laptop-ip:3001
   ```
4. Railway auto-detects Python and deploys
5. Get your backend URL: `https://your-backend.railway.app`

#### Option B: Render or Heroku
- Similar process, connect GitHub repo
- Add same environment variables
- Deploy from `backend/` directory

### 3. Frontend Deployment (Vercel/Netlify)

1. Push repo to GitHub
2. On Vercel/Netlify: Import repository
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app/api
   REACT_APP_WHATSAPP_SERVICE=http://your-laptop-ip:3001
   ```

### 4. WhatsApp Service (Separate Repo)

This runs on your always-on laptop:
1. Create separate GitHub repo for WhatsApp service
2. Clone and install: `npm install`
3. Create `.env`:
   ```
   MONGO_URL=mongodb+srv://...
   BACKEND_URL=https://your-backend-url.railway.app/api
   PORT=3001
   ```
4. Run: `node index.js`
5. Keep running 24/7

### 5. Network Configuration

For your laptop to communicate:
- Make WhatsApp service accessible to backend with your laptop's public/static IP
- Or use ngrok: `ngrok http 3001` to get public tunnel URL
- Update backend's `WHATSAPP_SERVICE_URL` to this URL

## Environment Files Template

### backend/.env (for development)
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/xac_crm_db
DB_NAME=xac_crm_db
JWT_SECRET=dev-secret-key-change-in-production
WHATSAPP_SERVICE_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### frontend/.env (for development)
```
REACT_APP_BACKEND_URL=http://localhost:8001/api
REACT_APP_WHATSAPP_SERVICE=http://localhost:3001
```

## GitHub Repository Structure
```
XAC-CRM/
├── backend/           # FastAPI services
├── frontend/          # React app
├── docker-compose.yml # For local development
├── DEPLOYMENT.md      # This file
└── README.md
```

## Running Locally (All 3 services)

1. MongoDB: `docker run -d -p 27017:27017 mongo`
2. WhatsApp: `cd whatsapp-service && npm install && node index.js`
3. Backend: `cd backend && pip install -r requirements.txt && uvicorn server:app --reload`
4. Frontend: `cd frontend && npm install && npm start`

Then access at `http://localhost:3000`

## Troubleshooting WhatsApp QR Code Issues

**Issue**: QR code not displaying after deployment

**Solutions**:
1. Verify `WHATSAPP_SERVICE_URL` in backend `.env` is correct
2. Check network connectivity from backend to WhatsApp service
3. Ensure WhatsApp service is actually running: `curl http://your-ip:3001/health`
4. Check browser console for CORS errors
5. Review container logs if using Docker

## Next Steps

1. Install Git: https://git-scm.com/download/win
2. Create GitHub repository
3. Push code
4. Set up MongoDB Atlas
5. Deploy to Railway (backend)
6. Deploy to Vercel (frontend)
7. Keep WhatsApp service running on laptop
