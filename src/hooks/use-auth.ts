import { authClient } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

function useAuth() {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("You have been logged out.")
                    navigate({ to: '/' })
                },
                onError: ({ error }) => {
                    toast.error(`Logout failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    const handleSignUp = async (value: {
        fullName: string;
        email: string;
        password: string;
    }) => {
        await authClient.signUp.email({
            name: value.fullName,
            email: value.email,
            password: value.password,
            callbackURL: "/dashboard",
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signup successful! Please check your email to verify your account.")
                    navigate({ to: "/dashboard" })
                },
                onError: (error) => {
                    toast.error(`Signup failed: ${error instanceof Error ? error.message : "Something went wrong."}`)
                }
            }
        })
    }

    const handleSignIn = async (value: {
        email: string;
        password: string;
    }) => {
        await authClient.signIn.email({
            email: value.email,
            password: value.password,
            // callbackURL: "/dashboard",
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signin successful! You are now logged in.")
                    navigate({ to: "/dashboard" })
                },
                onError: ({ error }) => {
                    if (error.status === 403) {
                        toast.error("Please verify your email address")
                        return
                    }
                    toast.error(`Signin failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    const handleRequestPasswordReset = async (email: string) => {
        const { data, error } = await authClient.requestPasswordReset({
            email,
            redirectTo: "/reset-password",
        })
        if (error) {
            toast.error(`Password reset failed: ${error.message || "Something went wrong."}`)
            return
        }
        toast.success(data.message || "Password reset email sent! Please check your email.")
    }

    const handlePasswordReset = async ({ newPassword, token }: { newPassword: string, token: string }) => {
        const { error } = await authClient.resetPassword({
            newPassword,
            token,
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Password reset successful! You can now log in with your new password.")
                    navigate({ to: "/login" })
                },
                onError: ({ error }) => {
                    toast.error(`Password reset failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
        if (error) {
            toast.error(`Password reset failed: ${error.message || "Something went wrong."}`)
            return
        }
    }

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
        })
    }


    return {
        handleSignOut,
        handleSignUp,
        handleSignIn,
        handleRequestPasswordReset,
        handlePasswordReset,
        handleGoogleSignIn
    }
}

export default useAuth
