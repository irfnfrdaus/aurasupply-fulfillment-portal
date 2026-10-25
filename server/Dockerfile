# Use official lightweight Node.js 20 on Alpine Linux (~50MB)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package manifest
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose backend REST API port
EXPOSE 5050

# Start the Express server
CMD ["node", "index.js"]
