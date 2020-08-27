"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
var logger = require('../log/logger');
var moment = require('moment');
var _a = require('../utilities/users'), validator = _a.validator, addUser = _a.addUser, removeUser = _a.removeUser, getUser = _a.getUser, getAllUsers = _a.getAllUsers;
var TimeOut;
// in MS
var inactivityTime = 30000;
function startTimeOut(socket, inactivityTime) {
    TimeOut = setTimeout(function () {
        socket.emit('timeOut');
    }, inactivityTime);
}
// SOCKET.IO
var socketIoInit = function (server) {
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
            try {
                validator(name);
                var user = addUser({ id: socket.id, name: name }).user;
                logger.info({
                    description: user.name + " has joined the chat!",
                    socketID: socket.id,
                    name: user.name,
                });
                socket.emit('message', {
                    user: 'admin',
                    text: user.name + " welcome to the realtime chat ",
                    time: moment().format('LT'),
                });
                socket.broadcast.emit('message', {
                    user: 'admin',
                    text: user.name + " has joined!",
                    time: moment().format('LT'),
                });
                // socket.join();
                io.emit('activeUsers', {
                    users: getAllUsers(),
                });
                //   callback();
            }
            catch (error) {
                socket.emit('login_error', { errorMessage: error.message });
                logger.error({
                    description: 'Login Fail',
                    reason: error.message,
                    socketID: socket.id,
                });
                socket.disconnect(true);
            }
        });
        socket.on('sendMessage', function (msg, callback) {
            if (TimeOut) {
                clearTimeout(TimeOut);
                TimeOut = null;
            }
            startTimeOut(socket, inactivityTime);
            var user = getUser(socket.id);
            io.emit('message', { user: user.name, text: msg });
            io.emit('activeUsers', {
                users: getAllUsers(),
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
                    users: getAllUsers(),
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
};
module.exports = {
    socketIoInit: socketIoInit,
};
