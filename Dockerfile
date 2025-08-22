# ====== Stage 1: Build ======
FROM node:20-alpine AS build
WORKDIR /app

# Otimiza cache
COPY package*.json ./
RUN npm ci

# Copia todo o código, incluindo .env
COPY . .

# Se quiser sobrepor variáveis do .env no build, passe como --build-arg
ARG VITE_ENABLE_MOCK
ARG VITE_API_URL

# Se os ARGs forem providos, escrevemos/atualizamos no .env antes do build
RUN set -eux; \
  if [ -n "${VITE_ENABLE_MOCK:-}" ]; then \
    grep -q '^VITE_ENABLE_MOCK=' .env && sed -i "s|^VITE_ENABLE_MOCK=.*|VITE_ENABLE_MOCK=${VITE_ENABLE_MOCK}|" .env || echo "VITE_ENABLE_MOCK=${VITE_ENABLE_MOCK}" >> .env; \
  fi; \
  if [ -n "${VITE_API_URL:-}" ]; then \
    grep -q '^VITE_API_URL=' .env && sed -i "s|^VITE_API_URL=.*|VITE_API_URL=${VITE_API_URL}|" .env || echo "VITE_API_URL=${VITE_API_URL}" >> .env; \
  fi

# Build de produção do Vite
RUN npm run build

# ====== Stage 2: Runtime (Nginx) ======
FROM nginx:alpine

# Config do SPA: fallback para /index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia artefatos do build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
