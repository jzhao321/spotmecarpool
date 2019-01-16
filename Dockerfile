FROM node:10.9.0-alpine
WORKDIR /code
COPY package*.json ./
RUN npm install --only=prod
COPY . .
ENV DATABASE_URL postgres://uwubiozhpribth:d8497db54422048576bf2b7a695087d05175648adaa444cfe5af368cbd634c34@ec2-54-163-246-159.compute-1.amazonaws.com:5432/df0s02iv6v9564
EXPOSE 3000
CMD ["npm", "start"]