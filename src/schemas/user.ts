import z from "zod";

export const userInputSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});