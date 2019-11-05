FROM node:10-alpine as builder

WORKDIR /project

COPY package*.json ./
COPY tsconfig.json tsconfig.json
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /project/dist /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
