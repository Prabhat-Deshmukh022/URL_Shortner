import { Hono } from "hono"
import { loginUser, registerUser } from "../controller/user.controller.ts"

const userRouter = new Hono()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

export {userRouter}