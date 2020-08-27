export {};
const winston = require('winston');
const logger = require('../log/logger');
const moment = require('moment');

const {
  validator,
  addUser,
  removeUser,
  getUser,
  getAllUsers,
} = require('../utilities/users');

let TimeOut: any;
// in MS
const inactivityTime = 30000;

function startTimeOut(socket: any, inactivityTime: number) {
  TimeOut = setTimeout(() => {
    socket.emit('timeOut');
  }, inactivityTime);
}

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
        try {
          validator(name);

          const { user } = addUser({ id: socket.id, name });

          logger.info({
            description: `${user.name} has joined the chat!`,
            socketID: socket.id,
            name: user.name,
          });

          socket.emit('message', {
            user: 'admin',
            text: `${user.name} welcome to the realtime chat `,
            time: moment().format('LT'),
          });

          socket.broadcast.emit('message', {
            user: 'admin',
            text: `${user.name} has joined!`,
            time: moment().format('LT'),
          });

          // socket.join();

          io.emit('activeUsers', {
            users: getAllUsers(),
          });

          //   callback();
        } catch (error) {
          socket.emit('login_error', { errorMessage: error.message });

          logger.error({
            description: 'Login Fail',
            reason: error.message,
            socketID: socket.id,
          });

          socket.disconnect(true);
        }
      }
    );

    socket.on('sendMessage', (msg: string, callback: () => void) => {
      if (TimeOut) {
        clearTimeout(TimeOut);
        TimeOut = null;
      }
      startTimeOut(socket, inactivityTime);
      const user = getUser(socket.id);

      io.emit('message', { user: user.name, text: msg });
      io.emit('activeUsers', {
        users: getAllUsers(),
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
          users: getAllUsers(),
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
