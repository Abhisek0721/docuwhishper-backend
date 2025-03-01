FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production && \
    npm install -g @nestjs/cli

COPY . .

RUN npx prisma generate && \
    npx prisma migrate deploy && \
    npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
