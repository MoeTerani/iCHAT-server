"use strict";
var app = require('express')();
var server = require('http').createServer(app);
var winston = require('winston');
var logger = require('./logger');
var cors = require('cors');
app.use(cors());
var _a = require('./users'), addUser = _a.addUser, removeUser = _a.removeUser, getUser = _a.getUser, getUsersInRoom = _a.getUsersInRoom;
// SOCKET.IO
var options = {
/* ... */
};
var io = require('socket.io').listen(server, {
    logger: {
        debug: winston.debug,
        info: winston.info,
        error: winston.error,
        warn: winston.warn,
    },
});
io.on('connection', function (socket) {
    /* ... */
    var errorMessage = ' ';
    socket.on('join', function (_a, callback) {
        var name = _a.name;
        var _b = addUser({ id: socket.id, name: name }), error = _b.error, user = _b.user;
        if (error) {
            console.log(error);
            logger.error({
                description: 'Unavailable username',
                reason: error,
                socketID: socket.id,
            });
            errorMessage = 'Unavailable username';
            socket.disconnect(true);
            return callback(error);
        }
        logger.info({
            description: user.name + " has joined the chat!",
            socketID: socket.id,
            name: user.name,
        });
        socket.emit('message', {
            user: 'admin',
            text: user.name + " welcome to the realtime chat ",
        });
        socket.broadcast
            .emit('message', { user: 'admin', text: user.name + " has joined!" });
        socket.join();
        io.emit('activeUsers', {
            users: getUsersInRoom(),
        });
        callback();
    });
    socket.on('sendMessage', function (msg, callback) {
        var user = getUser(socket.id);
        io.emit('message', { user: user.name, text: msg });
        io.emit('activeUsers', {
            users: getUsersInRoom(),
        });
        callback();
    });
    socket.on('disconnect', function () {
        var user = removeUser(socket.id);
        if (user) {
            io.emit('message', {
                user: 'admin',
                text: user.name + " has left!",
            });
            io.emit('activeUsers', {
                users: getUsersInRoom(),
            });
            logger.info({
                description: user.name + " has been disconnected!",
                socketID: socket.id,
                name: user.name,
            });
            socket.disconnect(true);
        }
    });
    socket.on('inActiveUser', function () {
        var user = removeUser(socket.id);
        if (user) {
            console.log('inactivity ');
            io.emit('message', {
                user: 'admin',
                text: user.name + " was disconnected due to\n        inactivity!",
            });
        }
        logger.info({
            description: user.name + "has been disconnected due to inactivity!",
            socketID: socket.id,
            name: user.name,
        });
        socket.disconnect(true);
    });
});
//MIDDLEWARE
var router = require('./router');
app.use(router);
//SERVER AND PORT
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});
