"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
var logger = require('../log/logger');
var moment = require('moment');
var axios = require('axios');
var _a = require('../utilities/users'), dataValidator = _a.dataValidator, addUser = _a.addUser, removeUser = _a.removeUser, getUser = _a.getUser, getAllUsers = _a.getAllUsers, getGitAvatar = _a.getGitAvatar;
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
            return __awaiter(void 0, void 0, void 0, function () {
                var avatar, user, error_1, avatar;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            dataValidator(name);
                            return [4 /*yield*/, getGitAvatar(name)];
                        case 1:
                            avatar = _b.sent();
                            console.log(avatar);
                            user = addUser({ id: socket.id, name: name, avatar: avatar }).user;
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
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            socket.emit('login_error', { errorMessage: error_1.message });
                            if (error_1.message === 'Request failed with status code 404') {
                                avatar = 'https://avatars2.githubusercontent.com/u/30356761?s=400&u=d7843e8ce40d3e48e2bb4a06f244c59af51c92ef&v=4';
                            }
                            logger.error({
                                description: 'Login Fail',
                                reason: error_1.message,
                                socketID: socket.id,
                            });
                            socket.disconnect(true);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
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
