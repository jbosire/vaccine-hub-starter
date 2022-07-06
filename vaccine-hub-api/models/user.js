const bcrypt = require("bcrypt")
const db = require("../db")
const {BCRYPT_WORK_FACTOR} = require("../config")
const {BadRequestError,UnauthorizedError} = require("../utils/errors")

class User {
    static async login(credentials){
        
        throw new UnauthorizedError("Invalid email/password combo")

    }

    static async register(credentials){

        const requiredFields = ["first_name","last_name","location","email","password"]
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email.");
        }


        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)

        const lowercasedEmail = credentials.email.toLowerCase();

        const result = await db.query(`
        INSERT INTO users(
            first_name,
            last_name,
            email,
            location,
            password
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id,first_name,last_name,email,location,date;
        `, [credentials.first_name,credentials.last_name,lowercasedEmail,credentials.location, hashedPassword]

        )

        const user = result.rows[0]

        return user;

    }

    static async fetchUserByEmail(email){
        if(!email){
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }
}

module.exports = User