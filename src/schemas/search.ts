import z from "zod";

export const filterSearchSchema = z.object({
    pageIndex: z.number(),
    pageSize: z.number(),
    query: z.string().optional().default(""),
})