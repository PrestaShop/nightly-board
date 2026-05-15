FROM node:14.21

RUN mkdir -p /app
EXPOSE 3000

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0

CMD [ "npm", "start" ]
