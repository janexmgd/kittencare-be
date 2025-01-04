import express from './apps/express.js';
import env from './utils/env.js';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routers/auth.router.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import userRouter from './routers/user.router.js';
import { failedResponse } from './utils/response.js';
const server = express();
const { NODE_ENV } = env;
server.use(cors());
server.use(helmet());
server.use(express.json());
if (NODE_ENV == 'development') {
  server.use(morganMiddleware);
}
server.use('/auth', authRouter);
server.use('/user', userRouter);
server.use('/*', (req, res, next) => {
  return failedResponse(res, { code: 404, message: 'api not found' });
});
server.use(errorHandler);

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'app running normally',
  });
});
export default server;
