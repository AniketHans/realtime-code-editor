# ===============================
#     1. BUILD THE APP
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files except those mentioned in .dockerignore
COPY . .

# Build Vite for production
RUN npm run build


# ===============================
#     2. SERVE WITH NGINX
# ===============================

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx files that also contain the default index.html served by nginx
RUN rm -rf ./*

# Copy built app from Node build
COPY --from=build /app/dist .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port for production
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


