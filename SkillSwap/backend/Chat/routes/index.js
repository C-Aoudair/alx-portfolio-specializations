import express from 'express';
import dbClient from '../utils/db.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  const user = await dbClient.getUser(req.params.userId);
  res.json(user);
})

router.get('/connections/:userId', async (req, res) => {
  const users = await dbClient.userConnections(req.params.userId);
  res.json(users);
});

router.get('/conversation', async (req, res) => {
    const { userId1, userId2 } = req.query;
    const conversation = await dbClient.getConversation(userId1, userId2);
    res.json(conversation);
});

router.post('/create-user', async (req, res) => {
    const data = req.body;
    const result = await dbClient.createUser(data);
    res.json(result);
});

export default router;
