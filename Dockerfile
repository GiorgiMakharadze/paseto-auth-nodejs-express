# Build Stage
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY src ./src
COPY tsconfig.json ./
RUN yarn run build

# Run Stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 8000
CMD [ "yarn", "run", "prod" ]
