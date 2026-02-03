import { sendChangeEmailConfirmationEmail, sendDeleteAccountVerificationEmail, sendPasswordResetEmail, sendVerificationLinkEmail } from "@/data/email";
import { db } from "@/db";
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [tanstackStartCookies()],
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, url }: { user: User; url: string; token: string }) => {
                void sendChangeEmailConfirmationEmail({
                    data: {
                        email: user.email,
                        name: user.name,
                        url
                    }
                })
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }: { user: User; url: string; token: string }) => {
                void sendDeleteAccountVerificationEmail({
                    data: {
                        email: user.email,
                        name: user.name,
                        url
                    }
                })
            }
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }: { user: User; url: string; token: string }) => {
            void sendVerificationLinkEmail({
                data: {
                    email: user.email,
                    name: user.name,
                    url
                }
            })
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }: { user: User; url: string; token: string }) => {
            console.log("sendResetPassword called with request:", url);
            void sendPasswordResetEmail({
                data: {
                    email: user.email,
                    name: user.name,
                    url
                }
            })
        },
        onPasswordReset: async ({ user }, request) => {
            // your logic here
            console.log(`Password for user ${user.email} has been reset. ${request}`);
        },
        errorMessages: {
            invalidCredentials: "The email or password you entered is incorrect.",
            unverifiedEmail: "Please verify your email address to continue.",
        }
    },
    socialProviders: {
        // github: {
        //     clientId: process.env.GITHUB_CLIENT_ID as string,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        // },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});