/** Shared config for application; can be req'd many places. */

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || 'development-secret-key';

const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = 12;

const DB_URI =
  process.env.NODE_ENV === 'test'
    ? "postgres://mooks2022:mookster21@localhost/outbreak_atlas_test"
    : "postgres://mooks2022:mookster21@localhost/outbreak_atlas";
    
        
module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI
};