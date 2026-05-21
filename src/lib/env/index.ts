import z from "zod";

export const {DATABASE_URL,API_HOST,NODE_ENV,API_PORT} = z.object({
    API_HOST:z.string().default("127.0.0.1"),
    NODE_ENV:z.enum(["development","production","test"]).default("development"),
    API_PORT:z.string().default("5647"),
    DATABASE_URL:z.string().default("file:./dev.db")
}).parse(process.env)