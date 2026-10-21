# MyDR24 — production image (Next.js standalone output)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are baked in at build time — pass them as build args.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_HELPLINE_TEL
ARG NEXT_PUBLIC_HELPLINE_DISPLAY
ARG NEXT_PUBLIC_WHATSAPP_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_GRIEVANCE_EMAIL
ARG NEXT_PUBLIC_PLAY_STORE_URL
ARG NEXT_PUBLIC_APP_STORE_URL
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 LEADS_FILE=/app/.data/leads.json
RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/.data && chown app:app /app/.data
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
VOLUME ["/app/.data"]
EXPOSE 3000
CMD ["node", "server.js"]
