"use strict";
var app = require('express')();
var server = require('http').createServer(app);
var cors = require('cors');
var socketIoInit = require('./socket/socket').socketIoInit;
app.use(cors());
//Initialize socket.io
socketIoInit(server);
//MIDDLEWARE
var router = require('./routes/router');
app.use(router);
//SERVER AND PORT
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});
