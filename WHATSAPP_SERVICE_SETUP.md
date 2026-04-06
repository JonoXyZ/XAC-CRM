# WhatsApp Service Setup Guide (Separate Repository)

## Overview

The WhatsApp service runs separately on an always-on laptop. It:
1. Maintains persistent WhatsApp sessions for each user
2. Stores credentials in MongoDB
3. Handles incoming/outgoing messages
4. Executes commands (like password reset)
5. Communicates with the main backend

## Prerequisites

- Node.js 18+
- MongoDB Atlas credentials (shared with backend)
- Persistent Windows/Mac/Linux machine
- Internet connection (24/7)

## Setup Steps

### 1. Create Repository

```powershell
# Initialize new repo
git init
git add .
git commit -m "WhatsApp Baileys Bot for XAC CRM"
git remote add origin https://github.com/YOUR-USERNAME/XAC-WhatsApp-Bot.git
git push -u origin main
```

### 2. Installation

```bash
npm install
```

### 3. Environment Configuration

Create `.env`:
```
# MongoDB - Same as backend!
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/xac_crm_db
DB_NAME=xac_crm_db

# Backend connection
BACKEND_URL=https://your-backend-railway.app/api
# Or local: http://localhost:8001/api

# Server config
PORT=3001
LOG_LEVEL=info
```

### 4. Running the Service

**Development**:
```bash
npm run dev  # or: node index.js
```

**Production (on laptop)**:
```bash
# Install PM2 for persistent running
npm install -g pm2

# Start service
pm2 start index.js --name "xac-whatsapp"

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 logs xac-whatsapp
```

### 5. QR Code Display

When service starts:
1. Open browser to `http://localhost:3001` (or your laptop IP)
2. First time for each user, scan QR code with WhatsApp
3. Session credentials stored in MongoDB
4. Service stays connected

## API Endpoints

These endpoints are used by the main backend:

```
POST   /start-session?user_id={id}     - Start new session, return QR
GET    /get-qr?user_id={id}             - Get current QR code
POST   /send-message                    - Send WhatsApp message
GET    /status?user_id={id}             - Check session status
POST   /disconnect?user_id={id}         - Disconnect session
GET    /health                          - Health check
```

## Making it Accessible from Internet

### Option 1: ngrok (Easiest for Testing)

```bash
# Install ngrok
# From https://ngrok.com

# Expose local port
ngrok http 3001

# Copy ngrok URL (e.g., https://xxxx-xx-xxx-xx-xxx.ngrok.io)
# Use this as WHATSAPP_SERVICE_URL in backend
```

### Option 2: Static IP + Port Forwarding

1. Configure static IP on your laptop
2. Port forward 3001 on router to laptop's IP
3. Use your router's public IP in backend config

### Option 3: Cloudflare Tunnel (Free)

```bash
# Install Cloudflare Tunnel
# Create tunnel and route to http://localhost:3001
# Get tunnel URL and use as WHATSAPP_SERVICE_URL
```

## Troubleshooting

### QR Code Not Generating
```bash
# Check if service is running
curl http://localhost:3001/health

# Check logs
npm run dev  # See console output

# Verify MongoDB connection
# Check MONGO_URL in .env
```

### Sessions Not Persisting
1. Ensure MongoDB is the same DB as backend
2. Check `sessionId` matches user IDs
3. Verify write permissions to MongoDB

### Connection Drops
1. Check internet connectivity
2. Verify backend can reach WhatsApp service
3. Check WhatsApp API rate limits
4. Review logs: `pm2 logs xac-whatsapp`

### QR Code Visible Locally but Not From Backend

**Problem**: Backend can't reach WhatsApp service

**Solutions**:
1. Use ngrok or Cloudflare tunnel (simplest)
2. Add laptop to same network as backend
3. Use public IP instead of localhost
4. Check firewall allows port 3001

Example with ngrok:
```bash
# Terminal 1: WhatsApp service
npm run dev

# Terminal 2: Start ngrok
ngrok http 3001

# Copy URL to backend WHATSAPP_SERVICE_URL
# Example: https://12345-67-89-abc.ngrok.io
```

## Keep Service Running 24/7

### Windows

**Option 1: Task Scheduler**
1. Create batch file `start-whatsapp.bat`:
   ```batch
   @echo off
   cd C:\path\to\XAC-WhatsApp-Bot
   npm start
   pause
   ```
2. Task Scheduler → Create Basic Task
3. Set to run on logon
4. Command: `C:\path\to\start-whatsapp.bat`

**Option 2: PM2 (Recommended)**
```bash
npm install -g pm2
pm2 start index.js --name "xac-whatsapp"
pm2 startup
pm2 save
```

### Mac/Linux
```bash
pm2 start index.js --name "xac-whatsapp"
pm2 startup
pm2 save
```

## Monitoring

```bash
# View logs
pm2 logs xac-whatsapp

# View status
pm2 status

# Restart
pm2 restart xac-whatsapp

# Stop
pm2 stop xac-whatsapp

# Delete
pm2 delete xac-whatsapp
```

## Database Structure

MongoDB collection: `whatsapp_sessions`

```javascript
{
  _id: ObjectId("..."),
  sessionId: "user123",
  data: {
    creds: { /* Baileys credentials */ },
    keys: { /* Connection keys */ }
  },
  created_at: ISODate("2026-04-06T..."),
  updated_at: ISODate("2026-04-06T...")
}
```

## Integration with Backend

Backend calls WhatsApp service for:
1. Starting sessions (with QR code)
2. Sending notifications to users
3. Processing incoming messages
4. Checking session status

Example from backend:
```python
async with httpx.AsyncClient(timeout=10.0) as client:
    response = await client.post(
        f"{WHATSAPP_SERVICE_URL}/send-message",
        json={
            "userId": user_id,
            "phoneNumber": phone,
            "message": "Your message here"
        }
    )
```

## Performance & Limits

- **Max concurrent sessions**: Depends on laptop resources
- **Typical**: 5-20 sessions stable
- **CPU usage**: 2-5% per session
- **Memory**: 50-100MB base + 20-30MB per session

## Updates & Maintenance

```bash
# Update Baileys
npm update @whiskeysockets/baileys

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Backup & Recovery

Credentials auto-save to MongoDB. To backup locally:
```bash
# Export sessions
mongoexport --uri="mongodb+srv://..." --collection whatsapp_sessions > backup.json

# Restore
mongoimport --uri="mongodb+srv://..." --collection whatsapp_sessions < backup.json
```

