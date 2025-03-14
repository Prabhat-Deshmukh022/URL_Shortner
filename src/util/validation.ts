import {z} from "zod";

const userValidationSchema = z.object(
    {
        email:z.string().email({"message":"This is not a valid email!"}).nonempty(),
        password:z
            .string()
            .min(8,{message:"at least 8 characters!"})
            .max(25,{message:"Exceeded character length!"})
            .nonempty()
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
    }
)

export {userValidationSchema}