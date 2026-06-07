import z from "zod";

export const registerSchema = z.object({
    name: z.string().max(50),
    email: z.email(),
    password: z.string()
})

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
})