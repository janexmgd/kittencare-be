import { randomUUID } from 'crypto';
import createError from '../utils/createError.js';
import { successResponse } from '../utils/response.js';
import { jwtDecode } from 'jwt-decode';
import { createPetsQuery } from '../models/pet.model.js';
const petController = {
  create: async (req, res, next) => {
    try {
      let token = req.headers.access_token;
      const decodedToken = jwtDecode(token);
      const usersId = decodedToken.data.users_id;
      const { name, gender, age } = req.body;
      const id = randomUUID();
      const dataToPetsCreate = {
        id: id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        age: age,
        gender: gender,
        owner_id: usersId,
        created_at: Date.now(),
        image_url: req.googleImageUrl,
        deleted_at: null,
      };
      const doCreatePet = await createPetsQuery(dataToPetsCreate);
      const data = doCreatePet.rows[0];

      successResponse(res, {
        code: 201,
        data,
        message: 'success create pet',
      });
    } catch (error) {
      next(error);
    }
  },
};
export default petController;
