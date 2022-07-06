const {UnauthorizedError} = require("../utils/errors")

class User {
    static async login(credentials){
        //user should submit their email and password
        //if any of these fields are missing, throw an error
        //look up the user in db by email
        // if user found, compare with submitted password
        //if anything goes wrong, throw an error
        throw new UnauthorizedError("Invalid email/password combo")

    }

    static async register(credentials){

        //user should submit their email and password
        //Ensure email doesn't already exist in db
        //take password and hash it
        //take email and lowercase it then make a new user

    }
}

module.exports = User