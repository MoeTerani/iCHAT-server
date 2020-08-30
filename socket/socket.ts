export {};
import winston from 'winston';
import { logger } from '../log/logger';
import moment from 'moment';
import { User } from '../types/types';

import { dataValidator, addUser, removeUser, getUser, getAllUsers, getGitAvatar } from '../utilities/users';

// inactivity time in milliseconds
const inactivityTime = 3000000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startTimeOut = (socket: any, inactivityTime: number) =>
    setTimeout(() => {
        socket.emit('timeOut');
    }, inactivityTime);

// SOCKET.IO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketIoInit = (server: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const io = require('socket.io').listen(server, {
        logger: {
            debug: winston.debug,
            info: winston.info,
            error: winston.error,
            warn: winston.warn,
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    io.on('connection', (socket: any) => {
        const botAvatar = 'https://github.com/MoeTerani/Assets/blob/master/iCHAT/chat-bot.jpg?raw=true';

        socket.on('join', async ({ name }: { name: string }) => {
            try {
                dataValidator(name);

                // Github Avatar End
                const avatar = await getGitAvatar(name);

                // Github Avatar End
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
                    avatar: botAvatar,
                    time: moment().format('LT'),
                });

                socket.broadcast.emit('message', {
                    user: 'admin',
                    text: `${user.name} has joined!`,
                    avatar: botAvatar,
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
        });
        let inactivity = startTimeOut(socket, inactivityTime);
        socket.on('sendMessage', (msg: string, callback: () => void) => {
            // if (inactivity) {
            //   clearTimeout(inactivity);
            //   inactivity = null;
            // }
            clearTimeout(inactivity);
            inactivity = startTimeOut(socket, inactivityTime);

            const user: User | undefined = getUser(socket.id);

            io.emit('message', {
                user: user?.name,
                text: msg,
                avatar: user?.avatar,
                time: moment().format('LT'),
            });
            io.emit('activeUsers', {
                users: getAllUsers(),
            });

            callback();
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on('disconnect', (reason: any) => {
            console.log({ reason });
            const user = removeUser(socket.id);

            if (user) {
                io.emit('message', {
                    user: 'admin',
                    text: `${user.name} left the chat!`,
                    avatar: botAvatar,
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
                    avatar: botAvatar,
                    time: moment().format('LT'),
                });
            }
            logger.info({
                description: `${user?.name}has been disconnected due to inactivity!`,
                socketID: socket.id,
                name: user?.name,
            });
            socket.disconnect(true);
        });
    });
};

module.exports = {
    socketIoInit,
};
