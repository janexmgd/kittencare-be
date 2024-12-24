import { jwtDecode } from 'jwt-decode';
import { successResponse } from '../utils/response.js';
import { queryGetUsersById } from '../models/users.model.js';

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
      return next(error);
    }
  },
};
export default userController;
