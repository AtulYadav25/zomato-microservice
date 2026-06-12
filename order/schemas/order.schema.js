import z from "zod";

export const placeOrderSchema = z.object({
    items: z.array(z.object({
        itemId: z.string(),
        quantity: z.number().min(1),
    })),
    deliveryAddress: z.object({
        addressLine1: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.number()
    })
})