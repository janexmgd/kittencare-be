import { randomUUID } from 'crypto';
import createError from '../utils/createError.js';
import { successResponse } from '../utils/response.js';
import { jwtDecode } from 'jwt-decode';
import {
  createPetsQuery,
  getPetsQuery,
  getTotalQuery,
} from '../models/pet.model.js';
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
  getPets: async (req, res, next) => {
    try {
      const { search_query, page, limit, sort, mode } = req.query;
      const searchQuery = search_query || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'name';
      const modeQuery = mode ? mode : 'ASC';
      const totalData = await getTotalQuery(searchQuery);
      const { total } = totalData.rows[0];
      const data = await getPetsQuery(
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery
      );
      successResponse(res, {
        code: 200,
        data: data.rows,
        pagination: {
          totalData: Number(total),
          currentPage: pageValue,
          dataPerPage: data.rowCount,
          totalPage: Math.ceil(total / limitValue),
        },
        message: 'success get pet',
      });
    } catch (error) {
      console.log(error);

      next(error);
    }
  },
};
export default petController;
