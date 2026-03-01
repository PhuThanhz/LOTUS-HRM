# ========== Stage 1: Build ==========
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --unsafe-perm

COPY . .

RUN chmod -R 755 node_modules/.bin
RUN npm run build


# ========== Stage 2: Run ==========
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

# SPA reload fix + chạy port 3001
RUN printf 'server { \
    listen 3001; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]