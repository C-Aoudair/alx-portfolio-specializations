import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import redisClient from './utils/redis.js';


const app = express();
const server = http.createServer(app);

redisClient.connect();

setTimeout(() => {
    redisClient.addUsersForTesting();
}, 1000);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
    });

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId || !(await redisClient.isAuthenticated(userId))) {
        socket.disconnect();
        return;
    }

    await redisClient.registerSocket(userId, socket.id);

    console.log(`User connected: ${userId}`);

    const messages = await redisClient.getMessagesForUser(userId);
    if (messages.length > 0) {
        messages.forEach((message) => {
            io.emit(`receiveMessage_${userId}`, message);
            console.log(`Message sent to user: ${userId} from cache`);
        });
        await redisClient.deleteMessagesForUser(userId);
    }

    socket.on('sendMessage', async (message) => {
        const receiverId = message.id;
        const messageBody = message.message;

        if (await redisClient.isSocketRegistered(receiverId)) {
            io.emit(`receiveMessage_${receiverId}`, messageBody);
            console.log(`Message sent to user: ${receiverId}`);
        } else {
            await redisClient.addMessage(receiverId, messageBody);
            console.log(`Message saved for user: ${receiverId}`);
        }

        socket.leave(receiverId);
    })

    socket.on('disconnect', async () => {
        await redisClient.registerSocket(userId, '');
        console.log(`User disconnected: ${userId}`);
    });
});

server.listen(4000, () => {
    console.log('Server running on port 4000');
});
