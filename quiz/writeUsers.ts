import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { User, UserRequest } from './types';


const router = express.Router()
let users: User[];
const dataFile = path.join(__dirname, '../data/users.json');

// Write new users to the JSON file
router.post('/write/adduser', (req: UserRequest, res: Response) => {
    let newuser = req.body as User;
    users.push(newuser);
    fs.writeFile(path.resolve(__dirname, dataFile), JSON.stringify(users), (err) => {
      if (err) console.log('Failed to write');
      else console.log('User Saved');
    });
    res.send('done');
  });

export default router;