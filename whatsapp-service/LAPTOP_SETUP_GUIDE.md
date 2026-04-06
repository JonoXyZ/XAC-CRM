# WhatsApp Bot Package - For Always-On Laptop
## Setup Guide for XAC CRM WhatsApp Service

This package contains everything needed to run the WhatsApp service on your always-on laptop.

---

## 📦 What's Included

```
whatsapp-service/
├── index.js                    # Main WhatsApp service (Baileys)
├── mongoAuth.js               # MongoDB session storage
├── package.json               # Node.js dependencies
├── .env                       # Configuration (create from .env.example)
├── .env.example               # Configuration template
├── Dockerfile                 # Docker setup (optional)
├── node_modules/              # Dependencies (generated after npm install)
└── auth_info/                 # Session data storage (created automatically)
```

---

## 🚀 Quick Start (5 minutes)

### 1. **Copy Files to Laptop**

Create a folder on your always-on laptop:
```
C:\WhatsApp-Bot\     (Windows)
OR
~/whatsapp-bot/      (Mac/Linux)
```

Copy these files there:
- `index.js`
- `mongoAuth.js`
- `package.json`
- `.env.example`
- `Dockerfile` (optional)

### 2. **Create Configuration File**

Create `.env` in the same folder:

```env
# MongoDB - SAME as your backend!
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/xac_crm_db
DB_NAME=xac_crm_db

# Backend URL - Where your main backend is hosted
BACKEND_URL=https://your-backend.railway.app/api
# For development: http://localhost:8001/api

# Port for WhatsApp service
PORT=3001
LOG_LEVEL=info
```

**Replace:**
- `username:password` with your MongoDB Atlas credentials
- `cluster.mongodb.net` with your actual cluster
- `your-backend.railway.app` with your backend URL (from Railway)

### 3. **Install Dependencies**

Open PowerShell/Terminal in the folder and run:

```bash
npm install
```

This will download:
- Baileys (WhatsApp library)
- Express (web server)
- MongoDB driver
- QR code generator
- Other utilities

**First time:** ~2-3 minutes
**Size:** ~400MB node_modules

### 4. **Start the Service**

```bash
npm start
```

You should see:
```
[WhatsApp Service] Running on port 3001
```

Keep this terminal/PowerShell window open!

### 5. **Scan QR Code (First Time Only)**

1. Laptop will generate a QR code
2. From your phone, open WhatsApp
3. Settings → Linked Devices → Link a Device
4. Scan the QR code shown in the terminal/browser
5. Done! Service will remember the session

---

## 🔧 Configuration Details

### MongoDB Connection String
You already have this from your backend setup. Format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER-NAME.mongodb.net/xac_crm_db
```

Example:
```
mongodb+srv://admin:MyP@ssw0rd@xaccrm-cluster.mongodb.net/xac_crm_db
```

### Backend URL
This is where your main CRM backend is running:

**Development (local):**
```
http://localhost:8001/api
```

**Production (Railway):**
```
https://your-backend-xyz.railway.app/api
```

Find this URL in Railway dashboard → your project → view.

### Port
Default is `3001`. Change if needed:
```env
PORT=3001
```

---

## 📱 API Endpoints

The service exposes these endpoints for your backend:

```
POST   /start-session        - Start new session with QR
GET    /qr/:userId          - Get QR code for user
GET    /status/:userId      - Check if user is connected
POST   /send-message        - Send WhatsApp message
POST   /disconnect/:userId  - Disconnect user session
GET    /status-all          - Get all sessions status
```

Your backend automatically uses these endpoints.

---

## 🔄 Keeping Service Running 24/7

### Windows

**Option 1: PM2 (Recommended)**

```bash
# Install PM2 globally (once)
npm install -g pm2

# Start service with PM2
pm2 start index.js --name "whatsapp-bot"

# Auto-start on boot
pm2 startup
pm2 save

# View logs anytime
pm2 logs whatsapp-bot

# Restart if needed
pm2 restart whatsapp-bot
```

**Option 2: Task Scheduler**

1. Create batch file `start-bot.bat`:
```batch
@echo off
cd C:\WhatsApp-Bot
npm start
pause
```

2. Open Task Scheduler
3. Create Basic Task
4. Trigger: "At startup"
5. Action: Run `C:\WhatsApp-Bot\start-bot.bat`

### Mac/Linux

```bash
# Install PM2 (if not already installed)
npm install -g pm2

# Start service
pm2 start index.js --name "whatsapp-bot"

# Auto-start on boot
pm2 startup
pm2 save
```

---

## 🌐 Making It Accessible from Internet

Since your laptop is where the service runs, your backend needs to reach it. You have options:

### Option 1: ngrok (Easiest - Recommended)

```bash
# Download from https://ngrok.com
# Sign up and get auth token

# Install ngrok (one time)
chocolatey install ngrok  # Windows
# OR manually download and add to PATH

# Start ngrok in new terminal
ngrok http 3001

# Copy the URL shown (e.g., https://abc123.ngrok.io)
# Use this as WHATSAPP_SERVICE_URL in your backend
```

**Pros:** Free, easy, works immediately
**Cons:** URL changes on restart (get paid plan for stable URL)

### Option 2: Static IP + Port Forwarding

1. Assign static IP to your laptop
2. Port forward 3001 on your router to laptop IP
3. Use your public IP: `http://your-public-ip:3001`
4. Update backend's `WHATSAPP_SERVICE_URL`

**Pros:** Stable, no third party
**Cons:** More setup, need static IP provider

### Option 3: VPN

Use a VPN service to connect backend to your laptop privately.

---

## 📋 Troubleshooting

### QR Code Not Generating
```bash
# Make sure service is running
npm start

# Check for errors in output
# Look for "Error" or "Connection" messages
```

**Solutions:**
1. Verify MongoDB connection string is correct
2. Check internet connectivity
3. Restart service: `Ctrl+C` then `npm start`

### Can't Connect to WhatsApp
```bash
# Check WhatsApp API limits
# Baileys has connection limits
# Wait 30 seconds and try again
```

**Solutions:**
1. Make sure WhatsApp account isn't logged in elsewhere
2. Disable 2FA temporarily
3. Try linking device again

### Backend Can't Reach Service
```bash
# Test if service is accessible
curl http://localhost:3001/status-all
```

If local check works but backend can't reach:
1. Check if using ngrok, Cloudflare tunnel, or port forwarding
2. Update backend's `WHATSAPP_SERVICE_URL`
3. Check firewall allows port 3001

### Sessions Not Saving
```bash
# Check MongoDB connection
# Verify MONGO_URL in .env is correct
# Check MongoDB allows connections from your IP
```

**Solutions:**
1. In MongoDB Atlas, whitelist your laptop IP (0.0.0.0/0 for dev)
2. Verify DB_NAME matches backend (`xac_crm_db`)
3. Check MongoDB has correct credentials

---

## 📊 Monitoring

### View Logs
```bash
# If using PM2
pm2 logs whatsapp-bot

# If running directly
# Logs show in terminal automatically
```

### Check Status
```bash
# If using PM2
pm2 status

# Check service manually
curl http://localhost:3001/status-all
```

### View Connected Users
```bash
curl http://localhost:3001/status-all
```

Example response:
```json
{
  "user123": {
    "connected": true,
    "hasQR": false,
    "user": { "id": "1234567890@c.us" }
  }
}
```

---

## 🔐 Security

**Important:**
- ✅ `.env` contains sensitive data (MONGO_URL, passwords)
- ✅ Never commit `.env` to GitHub
- ✅ Keep `.env` file protected (restricted access)
- ✅ Change passwords periodically
- ✅ Use strong MongoDB passwords

**.gitignore example:**
```
node_modules/
.env
auth_info/
*.log
```

---

## 📝 Typical Flow

1. **User tries to connect WhatsApp in CRM**
2. Frontend sends request to backend
3. Backend calls WhatsApp service: `POST /start-session`
4. WhatsApp service generates QR code
5. QR code shown in frontend modal
6. User scans with WhatsApp phone
7. Credentials stored in MongoDB
8. Service stays connected
9. Backend can send messages anytime

---

## 🚨 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "MONGO_URL not found" | Missing .env file | Copy .env.example → .env and fill values |
| "Cannot find module '@whiskeysockets/baileys'" | npm install not run | Run `npm install` |
| Service crashes on startup | MongoDB connection fails | Check MONGO_URL and whitelist IP in Atlas |
| QR code not displaying | Frontend can't reach service | Use ngrok or check firewall |
| Messages not sending | Session not connected | User must scan QR code first |
| Port 3001 already in use | Another service using port | Change PORT in .env or stop other service |

---

## 💡 Tips

- **Always run on machine that's on 24/7**
- **Keep MongoDB cluster running (Atlas always on)**
- **Use PM2 to auto-restart if service crashes**
- **Test with ngrok first before complex networking**
- **Monitor logs for connection issues**
- **Periodically scan new QR codes to refresh sessions**

---

## 📞 Support

If service stops working:

1. **Check logs:** `pm2 logs whatsapp-bot` or terminal output
2. **Restart:** `pm2 restart whatsapp-bot` or `npm start`
3. **Check MongoDB:** Verify connection string
4. **Check Backend:** Verify backend can reach this service
5. **Check WhatsApp:** Ensure account isn't logged in elsewhere
6. **Test Manually:** `curl http://localhost:3001/status-all`

---

## 📚 File Descriptions

### index.js
Main service file. Handles:
- Express server setup
- WhatsApp session management
- QR code generation
- Message sending/receiving
- Session persistence
- Error handling

### mongoAuth.js
MongoDB authentication. Handles:
- Database connection
- Session storage
- Credentials persistence
- Auth state management

### package.json
Defines all dependencies. Includes:
- Baileys (WhatsApp library)
- Express (server)
- MongoDB driver
- QR code generator
- Logging library

### .env
Configuration file. Contains:
- MongoDB credentials
- Backend URL
- Service port
- Log level

---

## 🎓 Learning Resources

- **Baileys GitHub:** https://github.com/WhiskeySockets/Baileys
- **Express.js:** https://expressjs.com/
- **MongoDB:** https://docs.mongodb.com/
- **PM2:** https://pm2.keymetrics.io/
- **ngrok:** https://ngrok.com/

---

**Setup Time:** ~10 minutes
**Difficulty:** Easy
**Maintenance:** Minimal (just keep it running)

Once this runs, your main CRM will be able to send WhatsApp messages and generate QR codes! 🎉
