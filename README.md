<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Variable Pricing Calculator

## Installation

```bash
$ npm install
```

## Preparing the database

```bash
# start a development PostgreSQL container
$ npm run dev:db

# run migrations
$ npm run migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Generating a token

```bash
# generate a token with subject 'user-1' and 'hirer' role
$ npm run dev:jwt -- user-1 hirer

# generate a token with subject 'user-2' and 'product' role
$ npm run dev:jwt -- user-2 product

# generate a token with subject 'user-3' and 'recruiter' role
$ npm run dev:jwt -- user-3 recruiter
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# run entire stack in docker, mounts config from ./config/env.js
# refer to the template ./config/env.template.js for example
$ docker compose up -d
```

## Quick API Reference

| Verb | Endpoint | Allowed Roles | Description |
| ---- | -------- | ------------- | ----------- |
| GET  | /whoami  | _any_ | Return JWT payload of access token as JSON |
| GET  | /job-classifications | _public_ | Retrieve paged list of job classifications |
| POST | /job-classifications | product | Add new job classification |
| GET  | /job-classifications/:id | _public_ | Retrieve a job classficiation |
| PATCH | /job-classifications/:id | product | Update a job classification |
| DELETE | /job-classifications/:id | product | Remove a job classification (FK constraint may return 5XX) |
| GET  | /job-location | _public_ | Retrieve paged list of job locations |
| POST | /job-location | product | Add new job location |
| GET  | /job-location/:id | _public_ | Retrieve a job location |
| PATCH | /job-location/:id | product | Update a job location |
| DELETE | /job-location/:id | product | Remove a job location (FK constraint may return 5XX) |
| GET | /pricing-rules | product | Retrieve paged list of pricing rules |
| POST | /pricing-rules | product | Add/update a pricing rule. Invalidates old entry and ups the version if an existing entry exist. |
| GET | /pricing-rules/:id | product | Retrieve a pricing rule |
| GET | /recruitment-briefs | _any_ | Retrieve a paged list of published or owned recruitment briefs. |
| POST | /recruitment-briefs | hirer | Add a new recruitment brief |
| GET | /recruitment-briefs/:id | _any_ | Retrieve a published or owned recruitment brief |
| PATCH | /recruitment-briefs/:id | _owner_ | Update a recruitment brief |
| GET | /recruitment-briefs/:id/recruitment-fee-quotation | hirer | Retrieve the recruitment fees of a published or owned recruitment brief |
| GET | /recruitment-briefs/:id/agency-fee-quotation | recruiter | Retrieve the agency fees of a published recruitment brief |


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
