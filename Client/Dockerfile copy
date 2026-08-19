# Stage 1: Build React application
FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Production API URL
ENV VITE_API_URL=/api

RUN npm run build


# Stage 2: Serve React app using Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# React Router configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]