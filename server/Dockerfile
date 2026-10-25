# Use official lightweight Node.js 20 on Alpine Linux (~50MB)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install clean production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose backend REST API port
EXPOSE 5050

# Start the Express server
CMD ["node", "index.js"]
