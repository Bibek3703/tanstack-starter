import z from "zod";

export const todoColumnSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: z.string()
})