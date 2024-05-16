# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Run stage
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install

COPY --from=build /app/src/keys ./keys

EXPOSE 8000

CMD ["node", "./build/server.js"]
