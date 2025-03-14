import { serve } from "@hono/node-server";
import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config({
  path:"./.env"
})

serve({
  fetch:app.fetch,
  port: Number(process.env.PORT)
})

console.log(`Server running at http://localhost:${process.env.PORT}`);
