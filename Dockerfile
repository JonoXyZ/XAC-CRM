# Multi-stage build: Build frontend, then run backend

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Run backend with frontend
FROM python:3.11-slim
WORKDIR /app

# Copy built frontend from builder
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install Python dependencies
COPY backend/requirements.txt backend/
RUN pip install -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Set environment
ENV PORT=8080
EXPOSE 8080

# Run the backend (which will serve the frontend)
CMD ["python", "backend/server.py"]
