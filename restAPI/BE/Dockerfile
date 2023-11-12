FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

# it is because nodemon is enable in the package json dependecies
CMD ["npm", "start"]