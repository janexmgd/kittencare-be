import { jwtDecode } from 'jwt-decode';
import { successResponse } from '../utils/response.js';
import { queryEditUsers, queryGetUsersById } from '../models/users.model.js';
import createError from '../utils/createError.js';
import Joi from 'joi';
import { deleteFile } from '../helpers/googleDrive.js';

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
      let token = req.headers.access_token;
      const decodedToken = jwtDecode(token);
      const usersId = decodedToken.data.users_id;
      const queryusersData = await queryGetUsersById(usersId);
      const usersData = queryusersData.rows[0];
      const imageidOld = usersData.image_url.split('/').pop();
      if (
        usersData.image_url !==
        'https://lh3.googleusercontent.com/d/1U_GCm419KgRGayTrw1a2YCFKQJsDQtdk/'
      ) {
        await deleteFile(imageidOld);
      }

      // example url https://drive.google.com/file/d/1U_GCm419KgRGayTrw1a2YCFKQJsDQtdk/view?usp=drivesdk
      const dataToImageEdit = {
        id: usersData.id,
        username: usersData.username,
        fullname: usersData.fullname,
        email: usersData.email,
        password: usersData.password,
        dateofbirth: usersData.dateofbirth,
        gender: usersData.gender,
        job: usersData.job,
        created_at: usersData.created_at,
        deleted_at: usersData.deleted_at,
        imageUrl: req.googleImageUrl,
      };
      const queryEditImage = await queryEditUsers(dataToImageEdit);
      return successResponse(res, {
        code: 200,
        message: 'success edit image',
        data: queryEditImage.rows[0],
      });
    } catch (error) {
      return next(error);
    }
  },
};
export default userController;
