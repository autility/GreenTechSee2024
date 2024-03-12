FROM node:14-alpine

WORKDIR /frontend/buggmodel

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 3000

RUN npm run build

RUN jest 

CMD ["npm", "run", "dev"]