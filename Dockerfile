# Use a base image with Node.js pre-installed
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that the application will listen on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]