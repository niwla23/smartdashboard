FROM node:18 as builder

WORKDIR /build

RUN npm i -g pnpm@7.22

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ADD . .

RUN pnpm build

FROM nginx:1.21
ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /app