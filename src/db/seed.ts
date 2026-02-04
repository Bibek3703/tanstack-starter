import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from '@/db/schema'
import { faker } from "@faker-js/faker";
import { desc } from "drizzle-orm";
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema });

const { todo, TodoStatuses, user } = schema

async function main() {
    console.log("Resetting database...");
    await db.delete(todo).execute();
    console.log("Database reset complete. Seeding data...");

    const users = await db.query.user.findMany({
        orderBy: desc(user.createdAt)
    });

    const todoData: schema.TodoInsert[] = Array.from({ length: 100 }).map((_, i) => ({
        title: faker.word.words({ count: 15 }),
        status: TodoStatuses[Math.floor(Math.random() * TodoStatuses.length)],
        userId: users[Math.floor(Math.random() * users.length)].id,
    }));

    await db.insert(todo).values(todoData);
}

main().catch(console.error);