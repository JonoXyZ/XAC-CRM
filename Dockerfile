# Multi-stage build: Build frontend, then run backend

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Run backend with frontend
FROM python:3.11-slim
WORKDIR /app

# Copy built frontend from builder
COPY --from=frontend-builder /build/frontend/build ./frontend/build

# Install system dependencies
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Set environment
ENV PORT=8000
EXPOSE 8000

# Run backend
CMD ["python", "server.py"]
