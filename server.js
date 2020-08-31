"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./log/logger");
var socket_1 = require("./socket/socket");
var app = require('express')();
var server = require('http').createServer(app);
var cors = require('cors');
var socketIoInit = require('./socket/socket').socketIoInit;
var createTerminus = require('@godaddy/terminus').createTerminus;
app.use(cors());
//Initialize socket.io
socketIoInit(server);
//MIDDLEWARE
var router = require('./routes/router');
app.use(router);
// SIGINT , SIGTERM
var closeAllActiveSockets = function () {
    console.info('closing server');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket_1.allConnectedSockets.forEach(function (socket) {
        socket.disconnect(true);
    });
};
createTerminus(server, {
    signals: ['SIGTERM', 'SIGINT'],
    onSignal: closeAllActiveSockets,
    logger: function () {
        return logger_1.logger.error({
            description: 'Server shutting down',
            reason: 'SIGTERM , SIGINT',
        });
    },
});
//SERVER AND PORT
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});
