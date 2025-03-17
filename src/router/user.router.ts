import { Hono } from "hono"
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.ts"
import { userVerification } from "../middleware/auth.middleware.ts"

const userRouter = new Hono()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout", userVerification, logoutUser)

export {userRouter}