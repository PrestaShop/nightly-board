# nightly-board

> Splendid PrestaShop nightly board

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ QANB_API_DOMAIN=http://api.nightly.com npm run build #to expose the domain name
$ NUXT_HOST=http://nightly.com NUXT_PORT=80 npm start #to expose the front domain name and port

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

### Configuration

You must pass the values via environment variables. Here they are:

|Variables          |   |
|-------------------|---|
| QANB_GA           | Google Analytics key  |
| QANB_API_DOMAIN   | URL for the API backend (must ends with a `/`)  |

The `QANB_API_DOMAIN` can be set when building the app (see above).
