"use strict";
var app = require('express')();
var server = require('http').createServer(app);
var cors = require('cors');
var socketIoInit = require('./socket/socket').socketIoInit;
// const { createTerminus } = require('@godaddy/terminus');
app.use(cors());
//Initialize socket.io
socketIoInit(server);
//MIDDLEWARE
var router = require('./routes/router');
app.use(router);
/* // SIGINT , SIGTERM and
const closeAllSockets = () => {
    console.info('closing server');
    const getConnectedSockets = () => Object.values(io.of('/').connected);
    getConnectedSockets().forEach((socket) => {
        socket.disconnect(true);
    });
};

createTerminus(server, {
    signals: ['SIGTERM', 'SIGINT'],
    onSignal: closeAllSockets,
    logger: () => logger.error('Server shutdown error'),
}); */
//SERVER AND PORT
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});
