import z from "zod";


export const itemSchema = z.object({
    name: z.string(),
    status: z.enum(["AVAILABLE", "NOT_AVAILABLE"]).default("AVAILABLE"),
    price: z.number()
})