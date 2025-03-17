import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { findUserById } from "../service/user.services.ts"

async function userVerification(c:Context, next: () => Promise<void>){
    const token = c.req.header("Authorization")?.split(" ")[1] || getCookie(c,"accesstoken")

    if(!token){
        return c.res.statusText
    }

    let isCorrect=null

    try {
        isCorrect = jwt.verify(token,process.env.SECRET) as JwtPayload
        console.log(`Verified token - ${isCorrect}`);
    } catch (error) {
        throw new Error("Token is false!")
    }

    const id = isCorrect.userId

    const user = await findUserById(id)

    if(!user){
        return c.res.statusText
    }

    // console.log(`user id is - ${user.id}`);

    c.set("userId",user.id)
    return next()

}

export { userVerification }