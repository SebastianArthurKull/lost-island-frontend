FROM node:16-alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
ENV SOCKET_URL=localhost
EXPOSE 3000
CMD npm run dev