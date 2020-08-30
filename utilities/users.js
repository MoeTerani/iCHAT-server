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
var Joi = require('joi');
var axios = require('axios');
var users = [];
var dataValidator = function (name) {
    /*   username is validated against the following rules:
      - is a required string
      -must contain only alphanumeric characters
      -at least 3 characters long but no more than 12
      -shouldn't already exist
      */
    var schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(20).required(),
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
// Get github avatar if exist else get random robot avatar from adorable API
var getGitAvatar = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var gitUserPublic;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios
                    .get("https://api.github.com/users/" + name)
                    .then(function (res) {
                    if (res.status === 200) {
                        var avatar = res.data.avatar_url;
                        return avatar;
                    }
                })
                    .catch(function (err) {
                    if (err.response.status === 404) {
                        var avatar = "https://api.adorable.io/avatars/285/" + name + "@adorable.png";
                        return avatar;
                    }
                })];
            case 1:
                gitUserPublic = _a.sent();
                return [2 /*return*/, gitUserPublic];
        }
    });
}); };
var addUser = function (_a) {
    var id = _a.id, name = _a.name, avatar = _a.avatar;
    var user = { id: id, name: name, avatar: avatar };
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
    dataValidator: dataValidator,
    addUser: addUser,
    removeUser: removeUser,
    removeAllUsers: removeAllUsers,
    getUser: getUser,
    getAllUsers: getAllUsers,
    getGitAvatar: getGitAvatar,
};
