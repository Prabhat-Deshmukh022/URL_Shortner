import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.ts";

async function createUser(email:string, hashedPassword:string){
    const user = await prisma.user.create({
        data:{
            email,
            password:hashedPassword
        }
    });

    return !!user
}

async function findUserByEmail(email:string){
    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    return user
}

async function verifyPassword(password:string,userId:string){

    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })

    if(!user){
        console.error("Error finding user!");
        return false
    }

    //@ts-ignore
    return bcrypt.compareSync(password,user.password as string);
}

async function findUserById(userId:string){
    return await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
}

export { createUser,findUserByEmail,verifyPassword,findUserById }