import { hash, compare } from 'bcrypt';
import moment from 'moment';
import { randomBytes, randomUUID } from 'crypto';
import createError from '../utils/createError.js';
import { successResponse } from '../utils/response.js';
import {
  checkRows,
  insertToUsers,
  queryLogin,
  queryVerifyingEmail,
} from '../models/auth.model.js';
import sendEmail from '../helpers/sendMail.js';
import createToken from '../utils/createToken.js';
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
      if (password !== confirmPassword)
        throw createError(400, 'password and confirmPassword must same');

      if (gender !== 'woman' && gender !== 'man')
        throw createError(400, 'invalid gender input');

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
      )}/auth/verify?code=${verifyCode}`;

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
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const checkEmail = await checkRows('users', 'email', email);
      if (checkEmail.rowCount === 0) {
        throw createError(400, 'email not registered');
      }
      if (checkEmail.rows[0].deleted_at !== null) {
        throw createError(
          400,
          'your account is deleted please contact administrator'
        );
      }
      const checkPassword = await compare(
        password,
        checkEmail.rows[0].password
      );
      if (!checkPassword) {
        throw createError(400, 'wrong password');
      }

      const checkAuth = await checkRows(
        'auths',
        'users_id',
        checkEmail.rows[0].id
      );
      if (checkAuth.rows[0].is_verified === false) {
        throw createError(400, 'your account not verified by email');
      }
      const dataToToken = {
        auth_id: checkAuth.rows[0].id,
        users_id: checkAuth.rows[0].users_id,
      };
      const access_token = await createToken(dataToToken, false);
      const refresh_token = await createToken(dataToToken, true);
      const authid = checkAuth.rows[0].id;
      const data = {
        authid,
        access_token,
        refresh_token,
      };
      const doLogin = await queryLogin(data);
      successResponse(res, {
        code: 200,
        status: 'success',
        message: 'success login',
        data: {
          access_token: doLogin.rows[0].access_token,
          refresh_token: doLogin.rows[0].refresh_token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  verifyingEmail: async (req, res, next) => {
    try {
      const { code } = req.query;
      const checkCode = await checkRows('auths', 'verify_code', code);
      if (checkCode.rowCount === 0)
        throw createError(400, 'invalid verify code');
      const doVerifyEmail = await queryVerifyingEmail(code);
      successResponse(res, {
        code: 200,
        status: 'success',
        message: 'email veifying is success',
        data: doVerifyEmail.rows[0],
      });
    } catch (error) {
      next(error);
    }
  },
};
export default authController;
