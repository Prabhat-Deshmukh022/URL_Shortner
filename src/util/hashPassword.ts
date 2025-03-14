import bcrypt from "bcryptjs";

function hashPassword(password:string){
    return bcrypt.hashSync(password,12)
}

export { hashPassword }