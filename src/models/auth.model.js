import db from '../config/pg.js';
export const insertToUsers = (data) => {
  return new Promise((resolve, reject) => {
    const {
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
    } = data;
    const query = `
    WITH insert_users AS (
    INSERT INTO users(id, username, fullname, email, gender, password, dateofbirth, job, created_at, deleted_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    )
    INSERT INTO auths(id, users_id, is_verified, created_at, verify_code)
    VALUES ($11, $1, $12, $9, $13)
    `;
    const values = [
      uuidUsers,
      username,
      fullName,
      email,
      gender,
      hashedPassword,
      dateBirth,
      job,
      createdDate,
      deletedAt,
      uuidAuth,
      isVerified,
      verifyCode,
    ];
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
export const checkIsExist = (field, value) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users WHERE ${field}='${value}'`, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
};
