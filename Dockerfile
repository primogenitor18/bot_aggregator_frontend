FROM node:21
WORKDIR /app
COPY package.json package.json
COPY . .
RUN npm install && npm run build
CMD ["npm", "run", "start"]
