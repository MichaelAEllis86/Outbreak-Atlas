// models userLocations.js
// this file is underconstruction! it contains model methods that pertain to the future feature of users saving locations!
// we have a db schema drawn up for this but it currently not in use 
const db = require("../db.js");
const bcrypt = require("bcrypt");
const User = require("./user");
const sqlForPartialUpdate =require("./user")
const { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError,} = require("../expressError.js");

class Locations{

    static async getAllLocations(){
        const result=await db.query(`SELECT * FROM user_locations ORDER BY id`)
        return result.rows;
    }

    static async getLocationById(id){
        const result=await db.query(`SELECT * FROM user_locations WHERE id=$1`,[id])
        const location=result.rows[0]

        if(!location){
            throw new NotFoundError()
        }
    }
    
    static async getUserLocations(user_id){
        const userResult=await db.query(`SELECT id FROM users WHERE id=$1`,[user_id])
        const user=userResult.rows[0]

         if (!user){
            throw new NotFoundError(`no user found for id: ${user_id}`, 404)
        }

        const locationResults=await db.query(`SELECT * FROM user_locations WHERE user_id=$1`,[user_id])

        return locationResults.rows
    }

    static async createNewLocation({user_id, nickname, zipcode, state}){
        const result=await db.query(`INSERT INTO user_locations
        (user_id,
        nickname,
        zipcode,
        state) VALUES($1, $2, $3, $4)
        RETURNING * `, [user_id, nickname, zipcode, state])

        return result.rows[0]
    }

    static async deleteLocation(id){

        const result= await db.query(`DELETE FROM user_locations WHERE id=$1 RETURNING id, zipcode, state`,[id])

        const location=result.rows[0]

        if(!location){
            throw new NotFoundError(`location not found for id ${id}`)
        }

        return {deleted:location}

    }

    static async updateLocation(id, data){

        const {setCols, values}=sqlForPartialUpdate(data)

        const idVarIdx = `$${values.length + 1}`;

        const querySQL=`UPDATE user_locations SET ${setCols} WHERE id = ${idVarIdx} RETURNING *`

        const result=await db.query(querySQL, [...values, id]);
        const location=result.rows[0]

        if(!location){
            throw new NotFoundError(`location not found for id ${id}`)
        }
        return location
    }
}

module.exports=Locations    



