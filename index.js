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
        var _b = _a.name, name = _b === void 0 ? 'Moe' : _b, _c = _a.room, room = _c === void 0 ? '1' : _c;
        var _d = addUser({ id: socket.id, name: name, room: room }), error = _d.error, user = _d.user;
        if (error) {
            logger.error({
                description: 'Unavailable username',
                reason: errorMessage,
                socketID: socket.id,
                username: user.name,
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
            text: user.name + " welcome to the room " + user.room,
        });
        socket.broadcast
            .to(user.room)
            .emit('message', { user: 'admin', text: user.name + " has joined!" });
        socket.join(user.room);
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
        callback();
    });
    socket.on('sendMessage', function (msg, callback) {
        var user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: msg });
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
        callback();
    });
    socket.on('disconnect', function () {
        var user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', {
                user: 'admin',
                text: user.name + " has left!",
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
            io.to(user.room).emit('message', {
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
