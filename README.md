# XAC CRM - Revival Fitness
Complete CRM system for Revival Fitness with WhatsApp integration powered by Baileys

## 🏗️ Architecture

- **Frontend**: React + Tailwind CSS (Vercel/Netlify)
- **Backend**: FastAPI + Motor (Railway/Render/Heroku)
- **Database**: MongoDB Atlas (Cloud)
- **WhatsApp Bot**: Node.js + Baileys (Always-on laptop)
- **Notifications**: In-app + WhatsApp push notifications

## 📋 Features

- Lead management and CRM workflows
- Commission tracking for consultants
- Bug reporting system
- WhatsApp integration for notifications
- Marketing dashboard and forms
- Analytics and reporting
- Appointment management
- Gallery management
- Settings and user management

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/XAC-CRM.git
cd XAC-CRM
```

### 2. Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 8001
- Frontend on port 3000

### 3. Manual Setup (Without Docker)

**Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm start
```

**WhatsApp Service**:
```bash
cd whatsapp-service
npm install
# Copy .env.example to .env and configure
node index.js
```

## 🔧 Environment Variables

### Backend (.env)
See `backend/.env.example`

Key variables:
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `WHATSAPP_SERVICE_URL`: URL to WhatsApp service

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001/api
REACT_APP_WHATSAPP_SERVICE=http://localhost:3001
```

## 📦 Project Structure

```
XAC-CRM/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   ├── package.json
│   └── tailwind.config.js
├── backend/               # FastAPI application
│   ├── server.py          # Main app
│   ├── mongoAuth.js       # MongoDB auth
│   ├── requirements.txt
│   └── tests/             # Test files
├── whatsapp-service/      # Baileys WhatsApp bot
│   ├── index.js
│   ├── mongoAuth.js
│   └── package.json
├── docker-compose.yml     # Docker Compose configuration
└── DEPLOYMENT.md          # Deployment guide
```

## 🧪 Testing

Run backend tests:
```bash
cd backend
pytest tests/
```

## 📚 Deployment

### See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- MongoDB Atlas setup
- Railway deployment (backend)
- Vercel deployment (frontend)
- WhatsApp service on laptop configuration
- Network setup and troubleshooting

### Quick Deployment Checklist
- [ ] Create GitHub repository
- [ ] Set up MongoDB Atlas cluster
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [ ] Set up WhatsApp service on laptop
- [ ] Test QR code and integration

## 📞 WhatsApp Integration

### Starting WhatsApp Session
1. User clicks "Connect WhatsApp"
2. QR code appears in modal
3. Scan with WhatsApp on phone
4. Session established and stored in MongoDB

### Features
- Automatic session persistence
- Reconnection handling
- Password reset via WhatsApp
- Message notifications
- Command processing

### Troubleshooting QR Issues
If QR code doesn't display after deployment:
1. Check `WHATSAPP_SERVICE_URL` is correct in backend
2. Verify WhatsApp service is accessible
3. Check browser console for CORS errors
4. Review service logs: `docker logs backend`

## 🔐 Security

- JWT authentication for API
- Bcrypt password hashing
- CORS configuration
- Environment variable secrets
- MongoDB connection security

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to GitHub: `git push origin feature/your-feature`
4. Open a Pull Request

## 🐛 Known Issues & Fixes

### WhatsApp QR Code Not Showing After Deployment
**Solution**: Update `WHATSAPP_SERVICE_URL` in backend environment to match your laptop's IP or ngrok tunnel URL.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

## 📄 License

Private project for Revival Fitness

## 🤝 Support

For issues, create a GitHub issue or contact the development team.
