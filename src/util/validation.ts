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

const urlSchema = z.string().nonempty().url()

const regionBasedUrlSchema = z.record(z.string().min(2).max(5),urlSchema).optional()

const timeBasedUrlSchema = z.
    array(
        z.object({
                url:urlSchema,
                startTime:z.string().datetime().nonempty(),
                endTime:z.string().datetime().nonempty()
            }
        )
    ).optional()

const abtestingUrlSchema = z.
    array(
        z.object({
            url:urlSchema,
            weight:z.number().min(1).max(100)
        })
    )
    .refine(
        (urls) => urls.reduce( (sum,entry) => sum+entry.weight,0 ) === 100, 
        {message:`Weights should always add upto 100!`}
    )

const urlValidationSchema = z.object({
        originalUrl:urlSchema,
        alias:z.string().optional(),
        regionBasedUrls:regionBasedUrlSchema,
        timeBasedUrls:timeBasedUrlSchema,
        abtestingUrls:abtestingUrlSchema
    }
)

export { userValidationSchema,urlValidationSchema }