import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface ISocket extends Socket {
  user?: any;
}

const gameRooms = new Map([['room1', { player1: null, player2: null, playing: false }]]);

// eslint-disable-next-line import/prefer-default-export
export const socketHandling = (server: any, logger: any) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3006',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket: ISocket, next) => {
    // fetch token from handshake auth sent by FE
    const { token } = socket.handshake.auth;
    try {
      // verify jwt token and get user data
      const body = jwt.verify(token, 'thisisasamplesecret');
      // const user = {
      //   id: 1,
      //   name: 'huy',
      // };
      logger.info(token, 'token');
      logger.info(body.sub, 'user');
      // save the user data into socket object, to be used further
      // eslint-disable-next-line no-param-reassign
      socket.user = body.sub;
      next();
    } catch (e: any) {
      // if token is invalid, close connection
      logger.info('error', e);
      return next(new Error(e.message));
    }
  });

  io.on('connection', (socket: ISocket) => {
    logger.info('connection ....');
    // join user's own room
    socket.join(socket.user.id);
    // socket.join('myRandomChatRoomId');
    // find user's all channels from the database and call join event on all of them.
    logger.info('a user connected');
    socket.on('disconnect', () => {
      logger.info('user disconnected');
    });
    socket.on('my message', (msg) => {
      logger.info(`message: ${msg}`);
      io.emit('my broadcast', `server: ${msg}`);
    });

    socket.on('join', (roomName) => {
      logger.info(`join: ${roomName}`);
      socket.join(roomName);
    });

    socket.on('message', ({ message, roomName }, callback) => {
      // generate data to send to receivers
      const outgoingMessage = {
        name: socket.user.name,
        id: socket.user.id,
        message,
      };
      // send socket to all in room except sender
      socket.to(roomName).emit('message', outgoingMessage);
      callback({
        status: 'ok',
      });
      // send to all including sender
      // io.to(roomName).emit('message', message);
    });

    socket.on('caro-start-game', (roomName, callback) => {
      const gameRoom = gameRooms.get(roomName);
      if (!gameRoom) return;
      if (gameRoom.player1 == null) {
        gameRoom.player1 = socket.user.id;
      }
      if (gameRoom.player2 == null) {
        gameRoom.player2 = socket.user.id;
      }
      if (gameRoom.player1 === gameRoom.player2) {
        gameRoom.player2 = null;
      }
      if (gameRoom.player1 && gameRoom.player2) {
        gameRoom.playing = true;
      }
      // send socket to all in room except sender
      socket.to(roomName).emit('caro-start-game', gameRoom);
      callback(gameRoom);
    });

    socket.on('caro-play-turn', ({ message, roomName }, callback) => {
      const outgoingMessage = {
        name: socket.user.name,
        id: socket.user.id,
        message,
      };
      // send socket to all in room except sender
      socket.to(roomName).emit('caro-play-turn', outgoingMessage);
      callback({
        status: 'ok',
      });
    });
  });
};
