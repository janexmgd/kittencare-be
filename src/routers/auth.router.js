import authController from '../controllers/auth.controller.js';
import express from '../apps/express.js';
import validate from '../middlewares/validate.js';
import {
  loginSchema,
  registerSchema,
} from '../validations/schema/auth.schema.js';
import imageUploaderMiddleware from '../middlewares/imageUploader.middleware.js';
const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/verify', authController.verifyingEmail);
export default authRouter;
