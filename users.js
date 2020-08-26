"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users = [];
var addUser = function (_a) {
    var id = _a.id, name = _a.name;
    if (!name) {
        return new Error('userName is missing.');
    }
    name = name.trim().toLowerCase();
    var existingUser = users.find(function (user) { return user.name === name; });
    if (existingUser) {
        return { error: 'This username is taken.' };
    }
    var user = { id: id, name: name };
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
var getUsersInRoom = function () { return users.filter(function (user) { return user; }); };
module.exports = { addUser: addUser, removeUser: removeUser, getUser: getUser, getUsersInRoom: getUsersInRoom };
