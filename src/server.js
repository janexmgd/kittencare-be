import express from './apps/express.js';
import env from './utils/env.js';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routers/auth.router.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
const server = express();
const { NODE_ENV } = env;
server.use(cors());
server.use(helmet());
server.use(express.json());
if (NODE_ENV == 'development') {
  server.use(morganMiddleware);
}
server.use('/auth', authRouter);
server.use(errorHandler);

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'app running normally',
  });
});
export default server;
