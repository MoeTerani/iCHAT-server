"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var path_1 = __importDefault(require("path"));
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '/loggedFiles/combined.log'),
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '/loggedFiles/error.log'),
            level: 'error',
        }),
    ],
});
