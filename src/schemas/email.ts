import z from "zod";

export const emailVerificationSchema = z.object({
    email: z
        .string()
        .min(1)
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        ),
    name: z.string().min(1),
    url: z.string().min(1),
});