FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Build if needed
RUN npm run build --if-present

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "index.js"]
