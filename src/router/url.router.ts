import { Hono } from "hono";
import { userVerification } from "../middleware/auth.middleware.ts";
import { produceShortUrl } from "../controller/url.controller.ts";

const urlRouter = new Hono()

urlRouter.post("/createUrl",userVerification,produceShortUrl)

export { urlRouter }