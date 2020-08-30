"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
var logger = require('../log/logger');
var moment = require('moment');
var _a = require('../utilities/users'), dataValidator = _a.dataValidator, addUser = _a.addUser, removeUser = _a.removeUser, getUser = _a.getUser, getAllUsers = _a.getAllUsers;
// inactivity time in milliseconds
var inactivityTime = 3000000;
var startTimeOut = function (socket, inactivityTime) {
    return setTimeout(function () {
        socket.emit('timeOut');
    }, inactivityTime);
};
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
                dataValidator(name);
                var avatar = 'https://avatars2.githubusercontent.com/u/30356761?s=400&u=d7843e8ce40d3e48e2bb4a06f244c59af51c92ef&v=4';
                var user = addUser({ id: socket.id, name: name, avatar: avatar }).user;
                logger.info({
                    description: user.name + " has joined the chat!",
                    socketID: socket.id,
                    name: user.name,
                });
                socket.emit('successful-connection', user.name, user.avatar);
                socket.emit('message', {
                    user: 'admin',
                    text: user.name + " welcome to the realtime chat ",
                    avatar: 'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
                    time: moment().format('LT'),
                });
                socket.broadcast.emit('message', {
                    user: 'admin',
                    text: user.name + " has joined!",
                    avatar: 'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
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
        var inactivity = startTimeOut(socket, inactivityTime);
        socket.on('sendMessage', function (msg, callback) {
            // if (inactivity) {
            //   clearTimeout(inactivity);
            //   inactivity = null;
            // }
            clearTimeout(inactivity);
            inactivity = startTimeOut(socket, inactivityTime);
            var user = getUser(socket.id);
            io.emit('message', {
                user: user.name,
                text: msg,
                avatar: user.avatar,
                time: moment().format('LT'),
            });
            io.emit('activeUsers', {
                users: getAllUsers(),
            });
            callback();
        });
        socket.on('disconnect', function (reason) {
            console.log({ reason: reason });
            var user = removeUser(socket.id);
            if (user) {
                io.emit('message', {
                    user: 'admin',
                    text: user.name + " left the chat!",
                    avatar: 'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
                    time: moment().format('LT'),
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
                    avatar: 'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
                    time: moment().format('LT'),
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
