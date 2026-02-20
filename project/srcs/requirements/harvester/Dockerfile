FROM node:20-slim
#FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

##RUN apk add --no-cache \
##	chromium \
##	nss \
##	freetype \
##	harfbuzz \
##	ca-certificates \
##	ttf-freefont
##
##ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
##ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json package-lock.json ./

RUN npm ci --only=production && npx playwright install chromium --with-deps

COPY . .

CMD ["node", "index.js"]