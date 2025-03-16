import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prisma } from "./config/prisma.js"
import { userRouter } from "./router/user.router.ts";
import { urlRouter } from "./router/url.router.ts";

const app = new Hono();

app.use("*",cors())
app.use("*",logger())

app.use("*", async (c,next) => {
    c.set("prisma",prisma)
    await next()
})

app.onError((err,c) => {
    console.error("ERROR CAUGHT: ",err)
    return c.json({error: "Internal Server Error!"},500)
})

app.route("/api/v1/user/",userRouter)
app.route("/api/v1/url",urlRouter)

export {app}