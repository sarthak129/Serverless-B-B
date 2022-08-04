FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /serverlessb2b
COPY  . /serverlessb2b/
RUN npm i 
EXPOSE 8080
CMD ["npm", "start"]
