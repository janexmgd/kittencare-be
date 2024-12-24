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
