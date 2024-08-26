import pkg from "mongodb";
const { MongoClient } = pkg;
import redisClient from './redis.js'

class DBClient {
  constructor() {
    if (DBClient.instance) {
      return DBClient.instance;
    }

    this.isConnected = false;
    this.host = process.env.DB_HOST || "localhost";
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || "chat";
    this.client = new MongoClient(`mongodb://${this.host}:${this.port}`, {
      useUnifiedTopology: true,
    });

    this.connect();
    DBClient.instance = this;
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("DBClient connected");
      this.isConnected = true;
    } catch (error) {
      console.error("Error connecting to database:", error);
      this.isConnected = false;
    }
  }

  isAlive() {
    return this.isConnected;
  }

  getCollection(collectionName) {
    return this.client.db(this.database).collection(collectionName);
  }

  async countDocuments(collectionName) {
    return this.getCollection(collectionName).countDocuments();
  }

  async findOne(collectionName, query) {
    return this.getCollection(collectionName).findOne(query);
  }

  async insertOne(collectionName, document) {
    return this.getCollection(collectionName).insertOne(document);
  }

  async updateOne(collectionName, filter, update) {
    return this.getCollection(collectionName).updateOne(filter, update);
  }

  async createUser(data) {
    const result = await this.insertOne("users", data);
    console.log('New user created with userId: ', data.userId);
    return result;
  }

  async getUser(userId) {
    const user = await this.findOne("users", { userId: parseInt(userId) });
    return {
      name: user.name,
      userId: user.userId,
      online: user.online,
    }
  }

  async userConnections(userId) {
    const user = await this.findOne("users", { userId: parseInt(userId) });
    const connectionsId = user.connections;
    const connections = Promise.all(connectionsId.map(async (id) => {
      const user = await this.findOne('users', { userId: parseInt(id)});
      return {
        name: user.name,
        userId: user.userId,
        online: user.online,
      }
    }));
    return connections;
  }


  async makeConnection(userId1, userId2) {
    const user1 = await this.findOne('users', { userId: parseInt(userId1) });
    const user2 = await this.findOne('users', { userId: parseInt(userId2) });
    const connections1 = user1.connections;
    const connections2 = user2.connections;
    
    if (!(connections1.includes(userId2))) {
      await this.updateOne("users", { userId: parseInt(userId1) }, { $push: { connections: userId2 } });
    }

    if (!(connections2.includes(userId1))) {
      await this.updateOne("users", { userId: parseInt(userId2) }, { $push: { connections: userId1 } });
    }
  }

  async insertMessage(senderId, receiverId, message) {
    const conversation = await this.findOne("conversations", {
      participants: { $all: [senderId, receiverId] },
    });
    if (conversation) {
      await this.updateOne(
        "conversations",
        { participants: { $all: [senderId, receiverId] } },
        { $push: { messages: { sender: senderId, text: message } } },
      );
    } else {
      await this.insertOne("conversations", {
        participants: [senderId, receiverId],
        messages: [{ sender: senderId, text: message }],
      });

      await this.makeConnection(senderId, receiverId);
    }
  }

  async getConversation(userId1, userId2) {
    const conversation = await this.findOne("conversations", {
      participants: { $all: [userId1, userId2] },
    });
	  const ownersId = conversation.participants.map((userId) => parseInt(userId));
    return {
	    ownersId,
	    messages: conversation.messages,
    };
  }

  async userConnected(userId) {
    await this.updateOne("users", { userId: parseInt(userId) }, { $set: { online: true } });
  }

  async userDisconnected(userId) {
    await this.updateOne("users", { userId: parseInt(userId) }, { $set: { online: false } });
  }
}

const dbClient = new DBClient();
export default dbClient;
