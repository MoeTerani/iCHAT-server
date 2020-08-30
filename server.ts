const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { socketIoInit } = require('./socket/socket');
// const { createTerminus } = require('@godaddy/terminus');

app.use(cors());

//Initialize socket.io
socketIoInit(server);

//MIDDLEWARE
const router = require('./routes/router');
app.use(router);

/* // SIGINT , SIGTERM and
const closeAllSockets = () => {
    console.info('closing server');
    const getConnectedSockets = () => Object.values(io.of('/').connected);
    getConnectedSockets().forEach((socket) => {
        socket.disconnect(true);
    });
};

createTerminus(server, {
    signals: ['SIGTERM', 'SIGINT'],
    onSignal: closeAllSockets,
    logger: () => logger.error('Server shutdown error'),
}); */

//SERVER AND PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
