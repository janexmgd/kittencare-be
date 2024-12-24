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
        if (err.code === '23505') {
          const errField = err.constraint.split('_')[1];
          reject({
            code: 400,
            message: `${errField} already exist`,
          });
        }
        reject({
          code: 500,
          message: `database error, ${err.message}`,
        });
      }
      resolve(results);
    });
  });
};
export const checkRows = (table, field, value) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM ${table} WHERE ${field}='${value}'`,
      (err, result) => {
        if (err) {
          reject({
            code: 500,
            message: `database error, ${err.message}`,
          });
        }
        resolve(result);
      }
    );
  });
};
export const queryVerifyingEmail = (verify_code) => {
  return new Promise((resolve, reject) => {
    const values = [true, verify_code];
    const query = `
      UPDATE auths
      SET is_verified = $1, verify_code=${null}
      WHERE verify_code = $2
      RETURNING *;
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
export const queryLogin = (data) => {
  return new Promise((resolve, reject) => {
    const { access_token, refresh_token, authid } = data;
    const values = [access_token, refresh_token, authid];
    const query = `
      UPDATE auths
      SET access_token = $1, refresh_token=$2
      WHERE id = $3
      RETURNING *;
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
