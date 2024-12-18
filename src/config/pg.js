import pg from 'pg';
const { Pool } = pg;
import pgParser from 'pg-connection-string';
const { parse } = pgParser;
import env from '../utils/env.js';
const { DATABASE_URL } = env;
const config = parse(DATABASE_URL);
const db = new Pool({
  database: config.database,
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
});
db.connect((err) => {
  console.log(`trying connection to database ${DATABASE_URL}`);

  if (err) {
    console.error(`db error\n${err.message}`);
    process.abort();
  } else {
    console.log(`connected to database >_<`);
  }
});
export default db;
