const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password'})
    }

    const user = await dbClient.db.collection('users').findOne({ email })
    if(user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);

    const result = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });

    return res.status(201).json({ email, id: result.insertedId });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token']
    const key = `auth_${token}`

    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unathourized'})
    }
  }
}

module.exports = UsersController;