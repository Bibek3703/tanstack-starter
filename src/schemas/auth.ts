import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { message: "Invalid email address" }
        ),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const signupSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { message: "Invalid email address" }
        ),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});