"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users = [];
var addUser = function (_a) {
    var id = _a.id, name = _a.name, room = _a.room;
    //trim() willl remove all white space in a string
    if (!name || !room) {
        return new Error('name or room is missing.');
    }
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    var existingUser = users.find(function (user) { return user.name === name && user.room === room; });
    if (existingUser) {
        return { error: 'This username is taken.' };
    }
    var user = { id: id, name: name, room: room };
    users.push(user);
    return { user: user };
};
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1)
        return users.splice(index, 1)[0];
};
var getUser = function (id) {
    return users.find(function (user) { return user.id === id; });
};
var getUsersInRoom = function (room) {
    return users.filter(function (user) { return user.room === room; });
};
module.exports = { addUser: addUser, removeUser: removeUser, getUser: getUser, getUsersInRoom: getUsersInRoom };
