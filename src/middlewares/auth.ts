import { auth } from "@/lib/auth";
import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const authFnMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next }) => {
        const headers = getRequestHeaders()
        const session = await auth.api.getSession({ headers });
        if (!session) {
            throw redirect({ to: '/login' })
        }

        return next({ context: { session } });
    });

export const authReqMiddleware = createMiddleware({ type: "request" }).server(
    async ({ next, request }) => {
        const url = new URL(request.url);
        if (!url.pathname.startsWith('/dashboard')) {
            return next();
        }
        const headers = getRequestHeaders()
        const session = await auth.api.getSession({ headers });
        if (!session) {
            throw redirect({ to: '/login' })
        }

        return next({ context: { session } });
    });