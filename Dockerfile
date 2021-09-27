FROM node:alpine
WORKDIR /usr/node-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]