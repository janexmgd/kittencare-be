import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
import env from '../utils/env.js';
import { checkRows } from '../models/auth.model.js';

const protectRoute = async (req, res, next) => {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) {
      throw createError(401, 'unathorized');
    }
    const isExist = await checkRows('auths', 'access_token', access_token);
    if (isExist.rowCount === 0) {
      throw createError(401, 'token no exist');
    }
    jwt.verify(access_token, env.SECRET_KEY, (err, result) => {
      // https://github.com/auth0/node-jsonwebtoken#jwtdecodetoken--options
      if (result) {
        next();
      }
      if (err) {
        let message = err.message || 'cannot verify token';
        throw createError(
          400,
          message.replace('jwt', 'token') || 'cannot verify JWT TOKEN'
        );
      }
    });
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
