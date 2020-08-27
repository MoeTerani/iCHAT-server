export {};
const winston = require('winston');
const logger = require('../log/logger');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('../utilities/users');

// SOCKET.IO
const socketIoInit = (server: any) => {
  const options = {
    /* ... */
  };
  const io = require('socket.io').listen(server, {
    logger: {
      debug: winston.debug,
      info: winston.info,
      error: winston.error,
      warn: winston.warn,
    },
  });

  io.on('connection', (socket: any) => {
    /* ... */
    let errorMessage = ' ';

    socket.on(
      'join',
      ({ name }: { name: string }, callback: (arg?: any) => void) => {
        const { error, user } = addUser({ id: socket.id, name });

        if (error) {
          console.log(error);
          logger.error({
            description: 'Unavailable username',
            reason: error,
            socketID: socket.id,
            // username: user.name,
          });
          errorMessage = 'Unavailable username';
          socket.disconnect(true);
          return callback(error);
        }

        logger.info({
          description: `${user.name} has joined the chat!`,
          socketID: socket.id,
          name: user.name,
        });

        socket.emit('message', {
          user: 'admin',
          text: `${user.name} welcome to the realtime chat `,
        });

        socket.broadcast.emit('message', {
          user: 'admin',
          text: `${user.name} has joined!`,
        });

        socket.join();

        io.emit('activeUsers', {
          users: getUsersInRoom(),
        });

        callback();
      }
    );

    socket.on('sendMessage', (msg: string, callback: () => void) => {
      const user = getUser(socket.id);

      io.emit('message', { user: user.name, text: msg });
      io.emit('activeUsers', {
        users: getUsersInRoom(),
      });

      callback();
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);

      if (user) {
        io.emit('message', {
          user: 'admin',
          text: `${user.name} has left!`,
        });
        io.emit('activeUsers', {
          users: getUsersInRoom(),
        });
        logger.info({
          description: `${user.name} has been disconnected!`,
          socketID: socket.id,
          name: user.name,
        });
        socket.disconnect(true);
      }
    });

    socket.on('inActiveUser', () => {
      const user = removeUser(socket.id);

      if (user) {
        console.log('inactivity ');
        io.emit('message', {
          user: 'admin',
          text: `${user.name} was disconnected due to
        inactivity!`,
        });
      }
      logger.info({
        description: `${user.name}has been disconnected due to inactivity!`,
        socketID: socket.id,
        name: user.name,
      });
      socket.disconnect(true);
    });
  });
};

module.exports = {
  socketIoInit,
};
