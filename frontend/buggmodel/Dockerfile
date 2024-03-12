FROM node:18-alpine

WORKDIR /frontend/buggmodel

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]