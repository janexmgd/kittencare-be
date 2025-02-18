import userController from '../controllers/user.controller.js';
import express from '../apps/express.js';
import protectRoute from '../middlewares/protectRoute.middleware.js';
import imageUploaderMiddleware from '../middlewares/imageUploader.middleware.js';
import validate from '../middlewares/validate.js';
import { editUsersSchema } from '../validations/schema/users.schema.js';
const userRouter = express.Router();

userRouter.get('/profile', protectRoute, userController.getMe);
userRouter.put(
  '/profile',
  protectRoute,
  validate(editUsersSchema),
  userController.editProfile
);
userRouter.get('/profile/:usersId', protectRoute, userController.profileDetail);
userRouter.patch(
  '/profile/image',
  protectRoute,
  imageUploaderMiddleware,
  userController.editImage
);

export default userRouter;
