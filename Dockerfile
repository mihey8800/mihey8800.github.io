FROM node:10-alpine
ENV APP_ROOT /web
ENV NODE_ENV=development

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm ci
RUN npm run build
RUN npm generate --save
RUN npm deploy --save

CMD ["npm", "run", "start"]