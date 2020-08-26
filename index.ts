const app = require('express')();
const server = require('http').createServer(app);
const winston = require('winston');
const logger = require('./logger');
const cors = require('cors');

app.use(cors());

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

// SOCKET.IO
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
    ({ name = 'Moe', room = '1' }, callback: (arg?: any) => void) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) {
        logger.error({
          description: 'Unavailable username',
          reason: errorMessage,
          socketID: socket.id,
          username: user.name,
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
        text: `${user.name} welcome to the room ${user.room}`,
      });

      socket.broadcast
        .to(user.room)
        .emit('message', { user: 'admin', text: `${user.name} has joined!` });

      socket.join(user.room);

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    }
  );

  socket.on('sendMessage', (msg: string, callback: () => void) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: msg });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left!`,
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
      io.to(user.room).emit('message', {
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

//MIDDLEWARE
const router = require('./router');
app.use(router);

//SERVER AND PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
