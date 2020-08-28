"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require('joi');
var users = [];
var validator = function (name) {
    /*   username is validated against the following rules:
      - is a required string
      -must contain only alphanumeric characters
      -at least 3 characters long but no more than 12
      -shouldn't already exist
      */
    var schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(12).required(),
    });
    var error = schema.validate({ username: name }).error;
    if (error) {
        throw new Error(error.message);
    }
    // Check if the userName exist
    name = name.trim().toLowerCase();
    var existingUser = users.find(function (user) { return user.name === name; });
    if (existingUser) {
        throw new Error('This username is taken.');
    }
};
var addUser = function (_a) {
    var id = _a.id, name = _a.name;
    var user = { id: id, name: name };
    users.push(user);
    return { user: user };
};
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1)
        return users.splice(index, 1)[0];
};
var removeAllUsers = function () { return users.splice(0, users.length); };
var getUser = function (id) {
    return users.find(function (user) { return user.id === id; });
};
// const getAllUsers = () => users.filter((user) => user);
var getAllUsers = function () { return users; };
module.exports = {
    validator: validator,
    addUser: addUser,
    removeUser: removeUser,
    removeAllUsers: removeAllUsers,
    getUser: getUser,
    getAllUsers: getAllUsers,
};
