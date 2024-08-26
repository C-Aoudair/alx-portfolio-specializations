import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import redisClient from './utils/redis.js';
import dbClient from './utils/db.js';
import router from './routes/index.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', async (socket) => {
  let userId = socket.handshake.query.userId;

  if (!userId || !(await redisClient.isAuthenticated(userId))) {
    socket.disconnect();
    return;
  }

  await redisClient.registerSocket(userId, socket.id);
  await dbClient.userConnected(userId);

  console.log(`User connected: ${userId}`);

  // const messages = await redisClient.getMessagesForUser(userId);
  // if (messages.length > 0) {
  //   messages.forEach((message) => {
  //     io.emit(`receiveMessage_${userId}`, message);
  //     console.log(`Message sent to user: ${userId} from cache`);
  //   });
  //   await redisClient.deleteMessagesForUser(userId);
  // }

  socket.on('sendMessage', async (message) => {
    const receiverId = message.id.toString();
    const messageBody = message.message;
    if (await redisClient.isSocketRegistered(receiverId)) {
      io.emit(`receiveMessage_${receiverId}`, {
	      sender: userId,
	      text: messageBody,
      });
      console.log(`Message sent to user: ${receiverId}`);
    } else {
      console.log(`Message saved for user: ${receiverId}`);
    }
    await dbClient.insertMessage(userId, receiverId, messageBody);
    await dbClient.makeConnection(userId, receiverId);
  });

  socket.on('disconnect', async () => {
    await redisClient.registerSocket(userId, '');
    await dbClient.userDisconnected(userId);
    console.log(`User disconnected: ${userId}`);
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
