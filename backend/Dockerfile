# Use Node.js version 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 8080 for the backend server
EXPOSE 8080

# Command to start the app
CMD ["npm", "start"]
