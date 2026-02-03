import z from "zod";

export const resetPasswordSearchParamsSchema = z.object({
    token: z.string()
})