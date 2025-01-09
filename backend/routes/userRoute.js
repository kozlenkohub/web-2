import express from 'express';
import { loginUser, registerUser, getUserCount, lastOrder } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/count', getUserCount);
userRouter.get('/last-order', lastOrder);

export default userRouter;
