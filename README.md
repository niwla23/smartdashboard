# smartdashboard
A custom dashboard for openHAB.
![Screenshot](screenshots/screen1.png)

## Usage
 - clone this repo
 - run `yarn`
 - put your config in static/configs folder. (you can also have it somewhere else if CORS is allowed)
 - run `yarn generate`
 - deploy `dist` folder to your webserver.
 - go to `http:<host>:<port>/config` and set the values
 - enjoy your dashboard


## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
