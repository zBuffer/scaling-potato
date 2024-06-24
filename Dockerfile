FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . ./
RUN npm run build

## RELEASE OPTIMISATION STAGE
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --only=prod

COPY --from=build-stage /app/dist ./dist
ENTRYPOINT [ "npm", "run" ]
CMD [ "start:prod" ]