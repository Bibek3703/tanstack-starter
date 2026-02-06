import { TodoStatuses } from "@/db/schema";
import z from "zod";

export const todoStatusSchema = z.enum(TodoStatuses);

export const todoColumnSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: todoStatusSchema
})

export const todoFormSchema = z.object({
    title: z.string(),
    status: todoStatusSchema,
})

export const todoInputSchema = z.object({
    title: z.string(),
    status: todoStatusSchema,
    userId: z.string()
})

export const todoUpdateSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: todoStatusSchema,
    userId: z.string()
})

export const todoDeleteSchema = z.object({
    id: z.string(),
    userId: z.string()
})

export const todosDeleteSchema = z.object({
    ids: z.string().array(),
    userId: z.string()
})