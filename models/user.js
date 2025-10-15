//models user.js
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const {sqlForPartialUpdate} =require("../utils/sqlUpdateHelper.js")
const { NotFoundError, BadRequestError, UnauthorizedError,} = require("../expressError");


/**
 * Generates a partial SQL `UPDATE` clause for the users table.
 *
 * Example usage:
 *   sqlForPartialUpdate(
 *     { firstName: 'Aliya', zipCode: 12345 },
 *     { firstName: 'first_name', zipCode: 'zipcode' }
 *   )
 * Returns:
 *   {
 *     setCols: '"first_name"=$1, "zipcode"=$2',
 *     values: ['Aliya', 12345]
 *   }
 *
 * @param {Object} dataToUpdate - JS object containing fields to update (e.g., { firstName: 'Aliya' }).
 * @param {Object} jsToSql - JS to SQL column name mapping (e.g., { firstName: 'first_name' }).
 * @returns {{ setCols: string, values: any[] }} SQL fragment and values array.
 * @throws {BadRequestError} If no data is provided.
 */
// function sqlForPartialUpdate(dataToUpdate, jsToSql) {
//   const keys = Object.keys(dataToUpdate);
//   if (keys.length === 0) throw new BadRequestError("No data");

//   const cols = keys.map((colName, idx) =>
//     `"${jsToSql[colName] || colName}"=$${idx + 1}`
//   );

//   return {
//     setCols: cols.join(", "),
//     values: Object.values(dataToUpdate),
//   };
// }

// module.exports = { sqlForPartialUpdate };

/**
 * User Class, represents a user in the db
 * handles registration, authentication, and retrival of user data.
 */
class User {
    
    
    /**
    * Registers a new user in the database.
    *
    * This method first checks if the username already exists.
    * If it does, it throws a BadRequestError.
    * Otherwise, it hashes the password and inserts a new user record
    * into the `users` table with the provided details.
    *
    * @param {Object} param0
    * @param {string} param0.username - The desired username of the new user.
    * @param {string} param0.password - The plain-text password for the new user.
    * @param {string} param0.first_name - The first name of the new user.
    * @param {string} param0.last_name - The last name of the new user.
    * @param {number} param0.age - The age of the new user.
    * @param {string} param0.zipcode - The zipcode of the new user.
    * @param {string} param0.state - The state of the new user.
    *
    * @throws {BadRequestError} If the username already exists in the database.
    *
    * @returns {Promise<Object>} Resolves to an object containing the newly created user's
    *   `id`, `username`, `first_name`, `last_name`, `age`, `zipcode`, `state`, and `is_admin` status.
    */
    static async registerNewUser ({username, password, first_name, last_name, age, zipcode, state }) {

        const checkDuplicate=await db.query(`SELECT username FROM users WHERE username=$1`, [username])
        
        if (checkDuplicate.rows[0]){
            throw new BadRequestError(`Duplicate username: ${username} please pick another name`)
        }

         const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        
        const result = await db.query(`INSERT INTO
            users(
            username,
            password,
            first_name,
            last_name,
            age,
            zipcode,
            state) VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, username,  first_name, last_name,  age,  zipcode,  state, is_admin  `,[username, hashedPassword, first_name, last_name, age, zipcode, state] )

        const user = result.rows[0];

        return user;

    }

    /**
    * Authenticates a user by verifying their username and password.
    *
    * This method queries the database for a user matching the given username.
    * If a user is found, it compares the provided password with the stored hashed password.
    * If the password matches, it returns the user object without the password field.
    * Otherwise, it throws an UnauthorizedError.
    *
    * @param {Object} param0
    * @param {string} param0.username - The username of the user attempting to authenticate.
    * @param {string} param0.password - The plain-text password provided for authentication.
    *
    * @throws {UnauthorizedError} If the username is not found or the password is incorrect.
    *
    * @returns {Promise<Object>} Resolves to the authenticated user object containing
    *   `id`, `username`, `first_name`, `last_name`, `age`, `zipcode`, `state`, and `is_admin`.
    */
    static async authenticateUser({username, password}){
        const result=await db.query(`SELECT id, username, password, first_name, last_name,  age,  zipcode, state, is_admin
            FROM users WHERE username=$1`,[username])

         const user = result.rows[0];
        
         if(user){
            const isValid=await bcrypt.compare(password,user.password);
            if(isValid){
                delete user.password
                return user;
            }
         }
         
             throw new UnauthorizedError("Invalid username/password");
         

    }

    /**
    * Retrieves all users from the database, ordered by username.
    *
    * @async
    * @function getAllUsers
    * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
    * Each user object contains the following properties:
    * - id {number} The user's unique identifier.
    * - username {string} The user's username.
    * - age {number} The user's age.
    * - zipcode {string} The user's postal code.
    * - state {string} The user's state.
    * - country {string} The user's country.
    * - created_at {Date} The timestamp when the user was created.
    */
    static async getAllUsers(){
        const result=await db.query(
            `SELECT id,
                username,
                first_name,
                last_name,
                age,
                zipcode,
                state,
                country,
                created_at,
                is_admin
            FROM users
            ORDER BY username`
        )
        return result.rows;
    }

    /**
    * Retrieve a user by their ID, along with all associated reports.
    *
    * @param {number|string} id - The ID of the user to retrieve.
    * @returns {Promise<Object>} A user object containing user fields and a `reports` array.
    * @throws {NotFoundError} If no user with the given ID is found.
    */
    static async getUserById(id){

        const [userRes, reportsRes] = await Promise.all([
            db.query(
             `SELECT id,
                username,
                first_name,
                last_name,
                age,
                zipcode,
                state,
                country,
                created_at,
                is_admin
            FROM users
            WHERE id = $1`,[id]
        ),
            db.query(`SELECT id, 
                user_id,
                created_at,
                symptoms,
                severity,
                temperature,
                notes,
                zipcode,
                state,
                latitude,
                longitude
                FROM reports WHERE user_id=$1`, [id]),
        ]);


        const user=userRes.rows[0]
        if (!user){
            throw new NotFoundError ("user not found", 404)
        }
        user.reports = reportsRes.rows;

        return user;
    }


    /**
    * Retrieve a user by their username, along with all associated reports.
    *
    * @param {number|string} username - The username of the user to retrieve.
    * @returns {Promise<Object>} A user object containing user fields and a `reports` array.
    * @throws {NotFoundError} If no user with the given username is found.
    */
    static async getUserByUsername(username){

        const userRes= await db.query(
             `SELECT id,
                username,
                first_name,
                last_name,
                age,
                zipcode,
                state,
                country,
                created_at,
                is_admin
            FROM users
            WHERE username = $1`,[username]
        );

        const user=userRes.rows[0]
        if (!user){
            throw new NotFoundError ("user not found", 404)
        }

        const reportsRes=await db.query(
              `SELECT * FROM reports WHERE user_id = $1`,[user.id]
        );


        user.reports = reportsRes.rows;

        return user;
    }



    static async deleteUserById(id){
        let result=await db.query(
            `DELETE
             FROM
             users
             WHERE id= $1
             RETURNING id, username`,[id]
        )
        const user=result.rows[0];
        if(!user){
            throw new NotFoundError ("user not found", 404)
        }

        return {deleted:user}

    }

      static async deleteUserByUsername(username){
        let result=await db.query(
            `DELETE
             FROM
             users
             WHERE username= $1
             RETURNING id, username`,[username]
        )
        const user=result.rows[0];
        if(!user){
            throw new NotFoundError ("user not found", 404)
        }

        return {deleted:user}

    }

    static async updateUserById(id, data){
        if (data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const {setCols, values}=sqlForPartialUpdate(data)

        const idVarIdx = `$${values.length + 1}`;

        const querySQL =`UPDATE users SET ${setCols} WHERE id = ${idVarIdx}
        RETURNING id, username, first_name, last_name, age, zipcode, state, country, created_at`

        const result=await db.query(querySQL, [...values, id]);
        const user= result.rows[0];

        if (!user)  throw new NotFoundError(`No user with id of: ${id}`);
        return user;

    }

    static async updateUserByUsername(username, data){
        if (data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const {setCols, values}=sqlForPartialUpdate(data)

        const usernameVarIdx = `$${values.length + 1}`;

        const querySQL =`UPDATE users SET ${setCols} WHERE username = ${usernameVarIdx}
        RETURNING id, username, first_name, last_name, age, zipcode, state, country, created_at`

        const result=await db.query(querySQL, [...values, username]);
        const user= result.rows[0];

        if (!user)  throw new NotFoundError(`No user with username of: ${username}`);
        return user;

    }


   
}

module.exports=User;


// CREATE TABLE users(
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(15) UNIQUE NOT NULL,
//     password_hash TEXT NOT NULL,
//     first_name VARCHAR(20) NOT NULL,
//     last_name VARCHAR(20) NOT NULL,
//     age INTEGER NOT NULL,
//     zipcode VARCHAR(5) NOT NULL CHECK (zipcode ~ '^\d{5}$'),
//     state CHAR(2) NOT NULL CHECK (state ~ '^[A-Z]{2}$'),
//     country VARCHAR(3) DEFAULT 'USA' NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW()

// )