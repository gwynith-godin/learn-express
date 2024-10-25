import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface UserRequest extends Request {
  users?: User[];
}

const app: Express = express();
const port: number = 8000;

const dataFile = '../data/users.json';

let users: User[];

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log('reading file ... ');
  if (err) throw err;
  users = JSON.parse(data.toString());
});

const addMsgToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  }
};

// Enable CORS for requests from localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

// important to define the endpoint in the correct order
// retrieve input on URI 
app.use('/read/username/:name', addMsgToRequest);
app.get('/read/username/:name', (req: UserRequest, res: Response) =>{
  
  let name = req.params.name;
  let user_w_name = req.users?.filter((user) => user.username === name);
  console.log(user_w_name);

  if (user_w_name) {
    // Return the email of the found user
    res.send(user_w_name);
  }
  else {
    return res.json({
      error: { message: 'users not found', status: 404 }
    });
  };
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req: UserRequest, res: Response) => {
  let newuser = req.body as User;
  users.push(newuser);
  fs.writeFile(path.resolve(__dirname, dataFile), JSON.stringify(users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});