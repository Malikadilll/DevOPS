# Use a lightweight Node.js version
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "Server.js"]
