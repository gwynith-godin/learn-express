import express, { Response } from 'express';
import { UserRequest } from './types';

const router = express.Router();

// Get all usernames
router.get('/usernames', (req: UserRequest, res: Response) => {
  const usernames = req.users?.map(user => ({ id: user.id, username: user.username }));
  res.json(usernames);
});

// Get user by username
router.get('/username/:name', (req: UserRequest, res: Response) => {
  const name = req.params.name;
  const userWithName = req.users?.filter(user => user.username === name);

  if (userWithName && userWithName.length > 0) {
    res.json(userWithName);
  } else {
    res.status(404).json({ error: { message: 'User not found' } });
  }
});

export default router;
