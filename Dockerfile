FROM node:12.18.3

EXPOSE 4000
EXPOSE 80

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build
CMD [ "npm", "start" ]