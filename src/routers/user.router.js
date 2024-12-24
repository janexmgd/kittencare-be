import userController from '../controllers/user.controller.js';
import express from '../apps/express.js';
import protectRoute from '../middlewares/protectRoute.middleware.js';
const userRouter = express.Router();

userRouter.get('/me', protectRoute, userController.getMe);

export default userRouter;
