FROM node:14 
WORKDIR /FOOD-DELIVERY-APP 
COPY client/myapp/package*.json  ./
RUN npx expo start
EXPOSE 8081
COPY server/package*.json ./
RUN npm start
EXPOSE 3500
