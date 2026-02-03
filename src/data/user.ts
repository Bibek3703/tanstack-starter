import { authFnMiddleware } from "@/middlewares/auth"
import { createServerFn } from "@tanstack/react-start"
import { db } from "@/db"
import fs from "fs/promises"
import path from "path"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export const updateUser = createServerFn({
    method: 'POST',
})
    .middleware([authFnMiddleware])
    .inputValidator((data: FormData) => {
        if (!(data instanceof FormData)) {
            throw new Error('Expected FormData')
        }

        return {
            name: data.get('name')?.toString() || '',
            image: data.get("image") as File | null
        }
    })
    .handler(async ({ data, context }) => {
        let imageUrl = null
        let { name, image } = data
        if (image && typeof image === "object" && image.size > 0) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads")
            await fs.mkdir(uploadsDir, { recursive: true })
            const filePath = path.join(uploadsDir, image.name)
            const arrayBuffer = await image.arrayBuffer()
            await fs.writeFile(filePath, Buffer.from(arrayBuffer))
            imageUrl = `/uploads/${image.name}`
        }
        await db.update(user)
            .set({
                name: name,
                ...(imageUrl ? { image: imageUrl } : {}),
            })
            .where(eq(user.id, context.session.user.id))
        return { success: true, image: imageUrl }
    })