import { createMiddleware, createStart } from "@tanstack/react-start";
import { authReqMiddleware } from "./middlewares/auth";

const loggingMiddleware = createMiddleware({ type: 'request' }).server(
    async ({ next, request }) => {
        const url = new URL(request.url);
        console.log('Request Pathname:', url.pathname);
        return next();
    }
);

export const startInstance = createStart(() => {
    return {
        requestMiddleware: [loggingMiddleware, authReqMiddleware]
    }
});