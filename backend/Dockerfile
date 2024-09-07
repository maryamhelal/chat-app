# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install build tools for bcrypt
RUN apk add --no-cache python3 make g++

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies and nodemon globally
RUN npm install && npm install -g nodemon ts-node typescript
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]