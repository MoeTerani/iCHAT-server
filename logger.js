"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
var path = require('path');
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, '/loggedFiles/combined.log'),
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '/loggedFiles/error.log'),
            level: 'error',
        }),
    ],
    timestamp: true,
});
module.exports = logger;
