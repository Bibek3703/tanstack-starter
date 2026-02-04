import { authClient } from '@/lib/auth-client'
import { emailChangeSchema, passwordChangeSchema } from '@/schemas/auth'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

function useSettings() {
    const navigate = useNavigate()
    const handleChangePassword = async (data: z.infer<typeof passwordChangeSchema>) => {
        await authClient.changePassword({
            newPassword: data.newPassword,
            currentPassword: data.currentPassword,
            revokeOtherSessions: true,
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Password changed successfully.")
                    navigate({ to: '/login' })
                },
                onError: ({ error }) => {
                    toast.error(`Password change failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    const handleChangeEmail = async (data: z.infer<typeof emailChangeSchema>) => {
        await authClient.changeEmail({
            newEmail: data.newEmail,
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Email changed successfully.")
                },
                onError: ({ error }) => {
                    toast.error(`Email change failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    const handleDeleteAccount = async () => {
        await authClient.deleteUser({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Account deleted successfully.")
                },
                onError: ({ error }) => {
                    toast.error(`Failed to delete account: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    return {
        handleChangePassword,
        handleChangeEmail,
        handleDeleteAccount
    }
}

export default useSettings
