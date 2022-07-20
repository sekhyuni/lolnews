FROM node:latest
COPY ./frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-d", "build"]
