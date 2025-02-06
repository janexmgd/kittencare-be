import db from '../config/pg.js';

export const createPetsQuery = async (data) => {
  try {
    const {
      id,
      name,
      age,
      gender,
      owner_id,
      created_at,
      image_url,
      deleted_at,
    } = data;
    const values = [
      id,
      name,
      age,
      gender,
      owner_id,
      created_at,
      image_url,
      deleted_at,
    ];
    const query = `
    INSERT INTO pets(id, name, age, gender, owner_id, created_at, image_url, deleted_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;
    const result = await db.query(query, values);
    return result;
  } catch (error) {
    if (error.code === '23505') {
      const errField = error.constraint.split('_')[1];
      throw {
        code: 400,
        message: `${errField} already exist`,
      };
    }
    throw {
      code: 500,
      message: `Database error: ${err.message}`,
    };
  }
};
export const getPetsQuery = async (searchQuery, offset, limit, sort, mode) => {
  try {
    const query = `SELECT * FROM pets WHERE LOWER(name)
    LIKE LOWER('%${searchQuery}%') ORDER BY ${sort} ${mode}
    LIMIT ${limit} OFFSET ${offset}
    `;
    const result = await db.query(query);
    return result;
  } catch (error) {
    if (error.code === '23505') {
      const errField = error.constraint.split('_')[1];
      throw {
        code: 400,
        message: `${errField} already exist`,
      };
    }
    throw {
      code: 500,
      message: `Database error: ${err.message}`,
    };
  }
};
export const getTotalQuery = async (searchQuery) => {
  try {
    const query = `SELECT COUNT(*) AS TOTAL FROM pets WHERE LOWER(name)
    LIKE LOWER('%${searchQuery}%')`;
    const result = await db.query(query);
    return result;
  } catch (error) {
    if (error.code === '23505') {
      const errField = error.constraint.split('_')[1];
      throw {
        code: 400,
        message: `${errField} already exist`,
      };
    }
    throw {
      code: 500,
      message: `Database error: ${error.message}`,
    };
  }
};
