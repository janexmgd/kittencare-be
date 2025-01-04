import db from '../config/pg.js';

export const queryGetUsersById = async (userId) => {
  try {
    const value = [userId];
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await db.query(query, value);
    return result;
  } catch (err) {
    console.error('Database Error:', err);
    throw {
      code: 500,
      message: `Database error: ${err.message}`,
    };
  }
};
export const queryEditUsers = async (data) => {
  return new Promise((resolve, reject) => {
    const {
      id,
      username,
      fullname,
      email,
      password,
      dateofbirth,
      gender,
      job,
      created_at,
      deleted_at,
      imageUrl,
    } = data;
    const values = [
      id,
      username,
      fullname,
      email,
      password,
      dateofbirth,
      gender,
      job,
      created_at,
      deleted_at,
      imageUrl,
    ];
    const query = `
    UPDATE users
    SET username = $2, fullname =$3, email=$4, password=$5,
    dateofbirth=$6, gender=$7, job=$8, created_at=$9, deleted_at=$10,
    image_url=$11
    WHERE id = $1
    RETURNING *
    `;
    db.query(query, values, (err, result) => {
      if (err) {
        reject({
          code: 500,
          message: `database error, ${err.message}`,
        });
      } else {
        resolve(result);
      }
    });
  });
};
