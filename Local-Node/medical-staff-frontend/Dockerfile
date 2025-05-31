FROM node:20-alpine

RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm","run","dev","--","--host","0.0.0.0"]