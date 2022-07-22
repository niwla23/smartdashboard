FROM node:14 as builder

WORKDIR /build
ADD . /build

RUN yarn 
RUN yarn generate

FROM nginx:1.21
ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /app