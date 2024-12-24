import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
import env from '../utils/env.js';

const protectRoute = async (req, res, next) => {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) {
      throw createError(401, 'unathorized');
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

    next();
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
