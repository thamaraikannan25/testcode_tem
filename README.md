# React + Fastify

Sample app using [React](https://reactjs.org/) for frontend and [Fastify](https://fastify.io/) for backend.

## Development

### Frontend

`ui` directory contains the frontend code created using [Create React App](https://create-react-app.dev).

Install dependencies and start development:

```sh
$ npm install
$ npm start
```

### Server

`server` directory contains the API server code using [Fastify](https://fastify.io/) framework. 

Install dependencies and start the server:

```sh
$ npm install
$ npm start
```

## Deployment

This application can be deployed to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/). Frontend is deployed as a static site component, while the server is deployed as a web service.

Clone the repo.

Adjust `./do/app.yaml` to match up your GitHub URLs.

Create app using [doctl](https://github.com/digitalocean/doctl):

```sh
doctl apps create --spec .do/app.yaml
```

