FROM node:18-alpine

WORKDIR /app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your backend listens on (example: 5000)
EXPOSE 5000

# Run your server
CMD ["npm", "start"]
