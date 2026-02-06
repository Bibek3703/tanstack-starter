import { db } from "@/db"
import { todo } from "@/db/schema"
import { authFnMiddleware } from "@/middlewares/auth"
import { filterSearchSchema } from "@/schemas/search"
import { todoDeleteSchema, todoInputSchema, todosDeleteSchema, todoUpdateSchema } from "@/schemas/todo"
import { createServerFn } from "@tanstack/react-start"
import { and, count, desc, eq, like } from "drizzle-orm"
import z from "zod"

export const getUserTodos = createServerFn({
    method: 'GET',
})
    .middleware([authFnMiddleware])
    .inputValidator(filterSearchSchema)
    .handler(async ({ context, data }) => {
        const { pageIndex, pageSize, query } = data
        const offset = pageIndex * pageSize

        const whereConditions = [eq(todo.userId, context.session.user.id)]

        if (query && query.trim()) {
            whereConditions.push(like(todo.title, `%${query}%`))
        }

        const result = await db.query.todo.findMany({
            where: and(...whereConditions),
            orderBy: desc(todo.createdAt),
            offset,
            limit: pageSize
        })
        console.log({ query })

        const [todos] = await db.select({ count: count() })
            .from(todo).where(and(...whereConditions))

        return {
            todosCount: todos?.count || 0,
            todos: result,
        }
    })

export const createTodo = createServerFn({
    method: 'POST',
})
    .middleware([authFnMiddleware])
    .inputValidator(todoInputSchema)
    .handler(async ({ context, data }) => {
        const { title, status, userId } = data

        if (context.session.user.id !== userId) {
            throw new Error("Unauthorized")
        }

        const newTodo = await db.insert(todo).values({
            title,
            status,
            userId
        }).returning();

        return newTodo
    })

export const updateTodo = createServerFn({
    method: 'POST',
})
    .middleware([authFnMiddleware])
    .inputValidator(todoUpdateSchema)
    .handler(async ({ context, data }) => {
        const { id, title, status, userId } = data

        if (context.session.user.id !== userId) {
            throw new Error("Unauthorized")
        }

        const updatedTodo = await db.update(todo).set({
            title,
            status,
        }).where(eq(todo.id, id)).returning();
        return updatedTodo
    })

export const deleteTodo = createServerFn({
    method: 'POST',
})
    .middleware([authFnMiddleware])
    .inputValidator(todoDeleteSchema)
    .handler(async ({ context, data }) => {
        const { id, userId } = data

        if (context.session.user.id !== userId) {
            throw new Error("Unauthorized")
        }

        await db.delete(todo).where(eq(todo.id, id)).returning();
        return true
    })

export const deleteTodos = createServerFn({
    method: 'POST',
})
    .middleware([authFnMiddleware])
    .inputValidator(todosDeleteSchema)
    .handler(async ({ context, data }) => {
        const { ids, userId } = data

        if (context.session.user.id !== userId) {
            throw new Error("Unauthorized")
        }
        const promise = []
        for (const id of ids) {
            promise.push(db.delete(todo).where(eq(todo.id, id)).returning())
        }
        await Promise.all(promise)
        return true
    })