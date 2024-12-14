import authController from '../controllers/auth.controller.js';
import express from '../apps/express.js';
import validate from '../middlewares/validate.js';
import { registerSchema } from '../validations/schema/auth.schema.js';

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), authController.register);

export default authRouter;
