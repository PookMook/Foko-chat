# Foko-chat

Real time chat project, still a lot of stuff to be done to be a proper usable project

## Tech stack

### Infrastructure

Docker/docker-compose for across the board compatibility. Assignment doesn't specify a target system, so docker leaves the most door open as it is available on any OS and is the easiest way to setup a development environment regardless of pre-existing procedures.

Docker-compose allow for an easy way to move from dev to production in a predictable way with minimum friction. It plays well with most existing reverse-proxy and SSL certification pipelines.

This leaves the door open for a switch to k8 if you need to management a different kind of scale (even tho, some other part of the stack would need to be addressed)

### Frontend

Basic CreateReactApp, with the last version of react-router 5 (Version 6 has just been released, waiting for the kirks to be ironed out) and finite state machines + state handled by Overmind.js.

Overmind manages most actions and state of the application. This provides a clear separation between the UI rendering and the state logic. It would also help with mocking when proper testing is introduced.

This architecture provides the advantage of being familiar with most developer on the react side, while providing decent performance/bundle size. One way forward could be to use an highly optimize framework like Nextjs with minimum change to the codebase.

Authentification is handled by JSON Web Tokens, in order to keep the backend stateless and easier to move to a decentralized architecture.


### Backend

The backend is handled by GraphQL Yoga, an opinionated framework built on top of Apollo-server (and thus node.js/express). Great starting point for a GraphQL API endpoint, supporting somewhat out of the box subscriptions over WebSockets. 

The database is handled by MongoDB (over mongoose ORM) as I understood it to be the target DB system and works great in that context. It also provides an easy upgrade path to cassandra DB if need be. [Discord Migration from mongo to cassandra](https://blog.discordapp.com/how-discord-stores-billions-of-messages-7fa6ec7ee4c7)

The PubSub service is handled in memory as there's only one instance of the backend running at the moment. For decentralized backends, Redis could be a drop-in replacement.

The backend re-hydrates basic information from the database on startup to create a graph of active users, open channels and last messages, then keep it up to date while the service is up, to improve reactivity and limit calls to the database. This would obviously need to be handled outside the node.js memory in case of a decentralized approach, Redis could also be a great candidate here.

## Deployement

In any case, you'll need to have docker installed on your machine/server to run the service. Docker-compose will help handle all of the deployment process for you.

You'll also need an active SendGrid account with a verified sender email address to manage the email communication (password recovery/invitation to a channel)

### Development

Just copy the example-docker-compose/dev.docker-compose.yaml to the root of this folder.
Modify the following lines to the appropriate environment values (docker-compose.yaml in the root directory is ignored via .gitignore): 

```
 - JWT_SECRET_TOKEN=SuperSecureButYouShouldChangeMe
 - "SENDGRID_API_KEY=SG.superSecure.SENDGRIDAPIKey"
 - SENDGRID_FROM_EMAIL=automailer@your.domain.com
```

Once this is done, you can docker-compose up.

Note for windows environment running over WSL, you need to change the target of the shared volumes for the frontend/backend from `./frontend` to `/c/Where/Ever/The/Project/is/Foko-chat/frontend/` as relative virtual links for volumes aren't supported.


```bash
cp example-docker-compose/dev.docker-compose.yaml docker-compose.yaml
vi docker-compose.yaml
docker-compose up --build
```

### Production

Production environment rely on you having a proper reverse-dns and ssl certification process. dockerfile are provided for  backend/frontend optimized for production container, but you'll need to configure the example-docker-compose/prod.docker-compose.yaml file to your need.
