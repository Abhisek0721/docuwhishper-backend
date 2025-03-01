FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --production --legacy-peer-deps && \
    yarn global add @nestjs/cli && \
    yarn add -D @types/express @types/multer --non-interactive

COPY . .

RUN npx prisma generate && \
    yarn build

EXPOSE ${PORT}

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
