import { PrismaClient } from "@prisma/client";
import { Context } from "hono";

declare module "hono" {
  interface ContextVariableMap {
    prisma: PrismaClient;
  }
}
