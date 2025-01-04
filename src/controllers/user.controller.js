import { jwtDecode } from 'jwt-decode';
import { successResponse } from '../utils/response.js';
import { queryGetUsersById } from '../models/users.model.js';
import createError from '../utils/createError.js';
import Joi from 'joi';

const userController = {
  getMe: async (req, res, next) => {
    try {
      let token = req.headers.access_token;
      const decodedToken = jwtDecode(token);
      const usersId = decodedToken.data.users_id;
      const data = await queryGetUsersById(usersId);
      return successResponse(res, {
        code: 200,
        message: 'success get me',
        data: data.rows[0],
      });
    } catch (error) {
      next(error);
    }
  },
  profileDetail: async (req, res, next) => {
    try {
      const { usersId } = req.params;
      const isUUID = Joi.string().uuid({ version: 'uuidv4' }).validate(usersId);
      if (isUUID.error) {
        throw createError(400, `invalid id`);
      }
      const data = await queryGetUsersById(usersId);
      if (data.rowCount === 0) {
        throw createError(404, `profile ${usersId} not found`);
      }
      return successResponse(res, {
        code: 200,
        message: 'success get profile detail',
        data: data.rows[0],
      });
    } catch (error) {
      return next(error);
    }
  },
  editImage: async (req, res, next) => {
    try {
      // console.log(req.files);
      return successResponse(res, {
        code: 200,
        message: 'success get profile detail',
        data: 'msmsm',
      });
    } catch (error) {
      return next(error);
    }
  },
};
export default userController;
