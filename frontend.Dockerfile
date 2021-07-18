FROM node:14.17.3

WORKDIR /frontend
COPY ./play_go_web_app/frontend . 

RUN npm i 
ENTRYPOINT ["npm", "run", "dev"]