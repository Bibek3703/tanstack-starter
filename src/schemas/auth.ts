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

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { message: "Invalid email address" }
        ),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const passwordChangeSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    currentPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const emailChangeSchema = z.object({
    newEmail: z
        .string()
        .min(1, { message: "Email is required" })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { message: "Invalid email address" }
        ),
});

export const deleteAccountSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { message: "Invalid email address" }
        ),
});