FROM node:10.9.0-alpine
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]