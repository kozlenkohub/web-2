import express from 'express';
import { loginUser, registerUser, getUserCount } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/count', getUserCount);

export default userRouter;
