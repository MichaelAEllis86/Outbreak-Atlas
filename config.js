/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "development-secret-key";
const PORT = +process.env.PORT || 3000;
const BCRYPT_WORK_FACTOR = 12;

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.TEST_DATABASE_URL;
} else if (process.env.NODE_ENV === "production") {
  DB_URI = process.env.DATABASE_URL;
} else {
  DB_URI = process.env.DEV_DATABASE_URL;
}

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI,
};
