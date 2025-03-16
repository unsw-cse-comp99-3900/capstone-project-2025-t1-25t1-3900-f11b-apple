# ---- Stage 1: Build the React app ----
    FROM node:18-alpine AS build

    # Create and change to the app directory
    WORKDIR /app
    
    # Copy package and lock files
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of your project files
    COPY . .
    
    # Build the production version of your app
    RUN npm run build
    
    # ---- Stage 2: Serve the built app with NGINX ----
    FROM nginx:stable-alpine
    
    # Copy build output to NGINX's html folder
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose port 80 (default NGINX port)
    EXPOSE 80
    
    # Start NGINX
    CMD ["nginx", "-g", "daemon off;"]
    