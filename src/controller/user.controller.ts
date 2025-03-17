import type { Context } from "hono";
import { userValidationSchema } from "../util/validation.ts";
import { createUser, findUserByEmail, verifyPassword } from "../service/user.services.ts";
import { hashPassword } from "../util/hashPassword.ts";
import { generateToken } from "../config/jwt.ts";
import { setCookie } from "hono/cookie";

const registerUser = async (c:Context) => {
    try {
        // 1️⃣ Parse request body properly
        const body = await c.req.json();

        // 2️⃣ Validate request using Zod
        const check = userValidationSchema.safeParse(body);
        if (!check.success) {
            console.error("❌ Validation failed:", check.error.format());
            return c.json({ error: "Invalid credentials", details: check.error.format() }, 400);
        }

        console.log("✅ Validation successful!");

        const { email, password } = check.data;

        // 3️⃣ Check if the user already exists
        const ifExists = await findUserByEmail(email);
        if (ifExists) {
            console.error("❌ User already exists:", email);
            return c.json({ error: "User already exists" }, 409);
        }

        // 4️⃣ Hash password securely
        const hashedPassword = await hashPassword(password); // Ensure this function is async

        // 5️⃣ Create user in the database
        const createdUser = await createUser(email, hashedPassword);
        if (!createdUser) {
            console.error("❌ Error in user creation");
            return c.json({ error: "Failed to create user" }, 500);
        }

        console.log("✅ User created successfully:", email);
        return c.json({ message: "User created successfully!" }, 201);

    } catch (error) {
        console.error("❌ Internal server error:", error);
        return c.json({ error: "Internal Server Error" }, 500);
    }
};

const loginUser = async (c:Context) => {
    const body = await c.req.json()

    const check = userValidationSchema.safeParse(body);

    if (!check.success) {
        console.error("❌ Validation failed:", check.error.format());
        return c.json({ error: "Invalid credentials", details: check.error.format() }, 400);
    }

    const {email,password} = check.data

    const ifExists = await findUserByEmail(email)

    if(!ifExists){
        console.error("❌ Wrong email entered");
        return c.json({ error: "Invalid credentials"}, 400);
    }

    const checkPassword = verifyPassword(password,ifExists.id)

    if(!checkPassword){
        console.error("❌ Wrong password entered");
        return c.json({ error: "Invalid credentials"}, 400);
    }

    const accesstoken = generateToken(ifExists.id)
    
    // Set HTTP-Only cookie
    setCookie(c,"accesstoken",accesstoken,{
        httpOnly:true,
        secure:true,
        sameSite:"Strict"
    })

    return c.json({ message: "Login successful!" }, 200);
}

const logoutUser = async (c:Context) => {

    const user = c.get("userId")

    if(!user){
        console.log(`User not logged in!`);
        return c.json({message:`User not logged in!`},401)
    }

    const option = {
        path:'/',
        httpOnly:true,
        secure:true,
        expires:new Date(0)
    }

    setCookie(c,"accesstoken","",option)

    return c.json({message:`User ${user} logged out`},200)
}

export { registerUser,loginUser,logoutUser };
