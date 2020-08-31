import { logger } from './log/logger';
import { allConnectedSockets } from './socket/socket';

const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { socketIoInit } = require('./socket/socket');
const { createTerminus } = require('@godaddy/terminus');

app.use(cors());

//Initialize socket.io
socketIoInit(server);

//MIDDLEWARE
const router = require('./routes/router');
app.use(router);

// SIGINT , SIGTERM
const closeAllActiveSockets = () => {
    console.info('closing server');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allConnectedSockets.forEach((socket: any) => {
        socket.disconnect(true);
    });
};

createTerminus(server, {
    signals: ['SIGTERM', 'SIGINT'],
    onSignal: closeAllActiveSockets,
    logger: () =>
        logger.error({
            description: 'Server shutting down',
            reason: 'SIGTERM , SIGINT',
        }),
});

//SERVER AND PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
