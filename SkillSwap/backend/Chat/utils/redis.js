import { createClient } from "redis";

class RedisClient {
    constructor() {
        this.client = null;
        this.connected = false;
        this.connect();
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

    async isAuthenticated(userId) {
        const logged = await this.client.get(`${userId}`);
        if (logged) {
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

    async disconnect() {
        await this.client.quit();
        console.log("Disconnected from Redis");
        this.connected = false;
    }
}

const redisClient = new RedisClient();

export default redisClient;

