import { hash, compare } from 'bcrypt';
import moment from 'moment';
import { randomBytes, randomUUID } from 'crypto';
import createError from '../utils/createError.js';
import { successResponse } from '../utils/response.js';
import { checkIsExist, insertToUsers } from '../models/auth.model.js';
import env from '../utils/env.js';
import sendEmail from '../helpers/sendMail.js';
const authController = {
  register: async (req, res, next) => {
    try {
      const {
        username,
        fullName,
        email,
        password,
        confirmPassword,
        gender,
        dob,
        job,
      } = req.body;
      if (password !== confirmPassword) {
        throw createError(400, 'password and confirmPassword must same');
      }
      if (gender !== 'woman' && gender !== 'man') {
        throw createError(400, 'invalid gender input');
      }
      const checkEmail = await checkIsExist('email', email);
      if (checkEmail.rowCount !== 0) {
        throw createError(400, 'email is already registered');
      }
      const checkUsername = await checkIsExist('username', username);
      if (checkUsername.rowCount !== 0) {
        throw createError(400, 'username already taken');
      }
      const hashedPassword = await hash(password, 10);
      const uuidUsers = randomUUID();
      const uuidAuth = randomUUID();
      const isVerified = false;
      const createdDate = Date.now();
      const verifyCode = randomBytes(32 / 2).toString('hex');
      const dateBirth = moment(dob).unix();
      const deletedAt = null;
      const data = {
        uuidUsers,
        uuidAuth,
        username,
        fullName,
        job,
        email,
        gender,
        hashedPassword,
        isVerified,
        verifyCode,
        createdDate,
        dateBirth,
        deletedAt,
      };
      await insertToUsers(data);
      const url = `${req.protocol}://${req.get(
        'host'
      )}/auth/verify-code=${verifyCode}`;

      await sendEmail(username, url);
      successResponse(res, {
        code: 200,
        status: 'success',
        message: 'success register',
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
export default authController;
