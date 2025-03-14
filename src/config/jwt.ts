import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path:"./.env" })

// console.log("SECRET:", process.env.SECRET);
// console.log("EXPIRY:", process.env.EXPIRY);

function generateToken(userId: string): string {
    const secret = process.env.SECRET ?? "";
    const expiry = process.env.EXPIRY ?? "1h"; // Default to 1 hour

    if (!secret) {
        throw new Error("SECRET environment variable is missing");
    }

    //@ts-ignore
    return jwt.sign({ userId }, secret as string, { expiresIn: expiry });
}

export {generateToken}