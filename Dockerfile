FROM node:20

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
ENV PORT=9999

CMD [ "npm","run","start" ]