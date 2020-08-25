"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.send('Server is up and running');
});
module.exports = router;
