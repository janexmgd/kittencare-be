import express from './apps/express.js';

import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routers/auth.router.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
const server = express();
server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(morganMiddleware);
server.use('/auth', authRouter);
server.use(errorHandler);

server.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'app running normally',
  });
});
export default server;
