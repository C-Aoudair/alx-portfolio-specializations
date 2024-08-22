import { createClient } from "redis";

class RedisClient {
    constructor() {
        this.client = null;
        this.connected = false;
    }

    async connect() {
        this.client = await createClient()
        .on("error", (error) => {
            console.error(error);
        })
        .on("connect", () => {
            this.connected = true;
            console.log("Connected to Redis");
        })
        .connect();
    }

    async addMessage(userId, message) {
        const key = `${userId}_Messages`;
        console.log(key)
        await this.client.lPush(key, message);
    }

    async getMessagesForUser(userId) {
        const key = `${userId}_Messages`;
        const messages = await this.client.lRange(key, 0, -1);
        return messages;
    }

    async deleteMessagesForUser(userId) {
        const key = `${userId}_Messages`;
        await this.client.del(key);
        console.log(`Messages deleted for user: ${userId}`);
    }

    async isAuthenticated(userId) {
        const user = await this.client.get(`user_${userId}`);
        if (user) {
            return true;
        }
        return false;
    }

    async registerSocket(userId, socketId) {
        await this.client.set(userId, socketId);
    }

    async isSocketRegistered(userId) {
        const socketId = await this.client.get(userId);
        if (socketId) {
            return true;
        }
        return false;
    }

    async addUsersForTesting() {
        await this.client.set("user_1", "socket_1");
        await this.client.set("user_2", "socket_2");
        await this.client.set("user_3", "socket_3");
        console.log("Users added for testing");
    }

    async disconnect() {
        await this.client.quit();
        console.log("Disconnected from Redis");
        this.connected = false;
    }
}

const redisClient = new RedisClient();

export default redisClient;

