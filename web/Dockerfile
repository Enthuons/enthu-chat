FROM node:alpine

ENV INSTALL_PATH /enthu-chat
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]