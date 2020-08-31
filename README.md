# iCHAT

# 🖥 Live Demo

## https://ichat-client.netlify.app/

Be patient on the first log-in. The Heruko server needs some time to get up and running.
<br/><br/>

### Server side of a realtime chatroom.

-   It has protected routes. The chat page is not accessible without authentication.
-   A username validation has been applied with corresponding Error messages.
-   Users can use Github username to retrieve their Github avatar.
-   If a Nickname is used, a random face avatar is fetched from the avatars.adorable.io/ API.
-   Dark/Light mode is available.
-   Send and received messages to all connected clients (no rooms).
-   The client will be disconnected automatically by a configurable timeout.
-   With any connection loss, corresponding Error messages will be sent to the client and notifications to others in the chat.
-   Provides readable logging solution
-   Terminates gracefully upon receiving SIGINT or SIGTERM.
    <br/><br/>

## 👨‍💻 Tech stack

<br/>
## Front-End

-   React (Functional components, Hooks)
-   Typescript
-   Redux-thunk
    <br/>

## Back-End

-   Node
-   Typescript
-   Express
-   Socket.io
-   winston
-   Joi
-   axios
-   moment
-   cors
-   Github API
-   Adorable.io API
-   Terminus
-   Jest
    <br/><br/>

## 🔥 Getting started

<br/>

After cloning the repository:

-   start by running `npm i` inside the root directory and then `npm run server`.
    <br/><br/>

## Test

-   In order to run the tests run `npm test` inside the root directory.
    <br/><br/>

## Linter

Eslint/Tslint and prettier has been applied in strict mode.
<br/><br/>

## 😎 Enjoy
