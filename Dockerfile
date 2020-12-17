FROM node:15.4.0
MAINTAINER jinsy731 <jinsy731@naver.com>
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]