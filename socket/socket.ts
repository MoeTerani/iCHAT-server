export {};
const winston = require('winston');
const logger = require('../log/logger');
const moment = require('moment');

const {
  dataValidator,
  addUser,
  removeUser,
  getUser,
  getAllUsers,
} = require('../utilities/users');

// inactivity time in milliseconds
const inactivityTime = 3000000;

const startTimeOut = (socket: any, inactivityTime: number) =>
  setTimeout(() => {
    socket.emit('timeOut');
  }, inactivityTime);

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
          dataValidator(name);
          let avatar =
            'https://avatars2.githubusercontent.com/u/30356761?s=400&u=d7843e8ce40d3e48e2bb4a06f244c59af51c92ef&v=4';
          const { user } = addUser({ id: socket.id, name, avatar });

          logger.info({
            description: `${user.name} has joined the chat!`,
            socketID: socket.id,
            name: user.name,
          });

          socket.emit('successful-connection', user.name, user.avatar);

          socket.emit('message', {
            user: 'admin',
            text: `${user.name} welcome to the realtime chat `,
            avatar:
              'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
            time: moment().format('LT'),
          });

          socket.broadcast.emit('message', {
            user: 'admin',
            text: `${user.name} has joined!`,
            avatar:
              'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
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
    let inactivity = startTimeOut(socket, inactivityTime);
    socket.on('sendMessage', (msg: string, callback: () => void) => {
      // if (inactivity) {
      //   clearTimeout(inactivity);
      //   inactivity = null;
      // }
      clearTimeout(inactivity);
      inactivity = startTimeOut(socket, inactivityTime);
      const user = getUser(socket.id);

      io.emit('message', {
        user: user.name,
        text: msg,
        avatar: user.avatar,
        time: moment().format('LT'),
      });
      io.emit('activeUsers', {
        users: getAllUsers(),
      });

      callback();
    });

    socket.on('disconnect', (reason: any) => {
      console.log({ reason });
      const user = removeUser(socket.id);

      if (user) {
        io.emit('message', {
          user: 'admin',
          text: `${user.name} left the chat!`,
          avatar:
            'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
          time: moment().format('LT'),
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
          avatar:
            'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true',
          time: moment().format('LT'),
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
