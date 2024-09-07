# Use an official Node.js runtime as the base image for building
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code into the container
COPY . .

# Build the React app
RUN npm run build

# Use an nginx container to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the server runs on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]