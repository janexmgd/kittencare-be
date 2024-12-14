import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
const { SECRET_KEY } = env;
const createToken = async (data, isRefresh = false) => {
  try {
    let expiredTime;
    if (isRefresh == true) {
      // 7 day
      let seconds = 7 * 24 * 60 * 60;
      expiredTime = Math.floor(Date.now() / 1000) + seconds;
    } else {
      // 2 hour
      let seconds = 2 * 60 * 60;
      expiredTime = Math.floor(Date.now() / 1000) + seconds;
    }
    return jwt.sign(
      {
        data: data,
        exp: expiredTime,
      },
      SECRET_KEY.trim(),
      { algorithm: 'HS256' }
    );
  } catch (error) {
    throw error;
  }
};
export default createToken;
