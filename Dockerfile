# Use Node.js version 18
FROM node:18

# Set working directory to backend
WORKDIR /app/backend

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend source
COPY backend/ .

# Expose port 5000 for the backend server
EXPOSE 5000

# Command to start the app
CMD ["npm", "start"]
