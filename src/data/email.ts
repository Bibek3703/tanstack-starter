import { emailVerificationSchema } from "@/schemas/email"
import { createServerFn } from "@tanstack/react-start"
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY

const resend = new Resend(apiKey);

export const sendVerificationLinkEmail = createServerFn({
    method: 'POST',
})
    .inputValidator(emailVerificationSchema)
    .handler(async ({ data }) => {
        console.log("sendVerificationEmail called with data:", data);
        if (!apiKey) {
            console.error("Resend API key is not configured");
            return;
        }
        const { email, name, url } = data;
        const from = 'TanStack Starter <onboarding@khelkudnepal.com>';

        const { data: emailData, error } = await resend.emails.send({
            from,
            to: [email],
            subject: 'Verify your email address',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Click the link to verify your email:</p>
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Verify Email
                </a>
                <p>Or copy this link: ${url}</p>
            `,
        });

        if (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Failed to send verification email");
        }

        console.log("Verification email sent successfully:", emailData);
    })


export const sendPasswordResetEmail = createServerFn({
    method: 'POST',
})
    .inputValidator(emailVerificationSchema)
    .handler(async ({ data }) => {
        console.log("sendPasswordResetEmail called with data:", data);
        if (!apiKey) {
            console.error("Resend API key is not configured");
            return;
        }
        const { email, name, url } = data;
        const from = 'TanStack Starter <onboarding@khelkudnepal.com>';

        const { data: emailData, error } = await resend.emails.send({
            from,
            to: [email],
            subject: 'Reset your password',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Click the link to reset your password:</p>
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
                <p>Or copy this link: ${url}</p>
            `,
        });

        if (error) {
            console.error("Error sending password reset email:", error);
            throw new Error("Failed to send password reset email");
        }

        console.log("Password reset email sent successfully:", emailData);
    })

export const sendChangeEmailConfirmationEmail = createServerFn({
    method: 'POST',
})
    .inputValidator(emailVerificationSchema)
    .handler(async ({ data }) => {
        console.log("sendChangeEmailConfirmationEmail called with data:", data);
        if (!apiKey) {
            console.error("Resend API key is not configured");
            return;
        }
        const { email, name, url } = data;
        const from = 'TanStack Starter <onboarding@khelkudnepal.com>';

        const { data: emailData, error } = await resend.emails.send({
            from,
            to: [email],
            subject: 'Confirm your new email address',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Click the link to confirm your email:</p>
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Confirm Email
                </a>
                <p>Or copy this link: ${url}</p>
            `,
        });

        if (error) {
            console.error("Error sending change email confirmation email:", error);
            throw new Error("Failed to send change email confirmation email");
        }

        console.log("Change email confirmation email sent successfully:", emailData);
    })

export const sendDeleteAccountVerificationEmail = createServerFn({
    method: 'POST',
})
    .inputValidator(emailVerificationSchema)
    .handler(async ({ data }) => {
        console.log("sendDeleteAccountVerificationEmail called with data:", data);
        if (!apiKey) {
            console.error("Resend API key is not configured");
            return;
        }
        const { email, name, url } = data;
        const from = 'TanStack Starter <onboarding@khelkudnepal.com>';

        const { data: emailData, error } = await resend.emails.send({
            from,
            to: [email],
            subject: 'Confirm your account deletion',
            html: `
                <h1>Welcome ${name}!</h1>
                <p>Click the link to confirm your account deletion:</p>
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Confirm Account Deletion
                </a>
                <p>Or copy this link: ${url}</p>
            `,
        });

        if (error) {
            console.error("Error sending delete account verification email:", error);
            throw new Error("Failed to send delete account verification email");
        }

        console.log("Delete account verification email sent successfully:", emailData);
    })