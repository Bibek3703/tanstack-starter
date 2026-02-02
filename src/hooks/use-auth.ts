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
            // callbackURL: "/dashboard",
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
                    console.log({ error })
                    toast.error(`Signin failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    return { handleSignOut, handleSignUp, handleSignIn }
}

export default useAuth
