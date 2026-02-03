import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { resetPasswordSchema } from '@/schemas/auth'
import { useForm } from '@tanstack/react-form'
import React from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

function ResetPasswordForm({
    className,
    token,
    ...props
}: React.ComponentProps<"form"> & { token: string }) {

    const { handlePasswordReset } = useAuth()
    const [isPending, startTransition] = React.useTransition()
    const form = useForm({
        defaultValues: {
            password: ""
        },
        validators: {
            onSubmit: resetPasswordSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                if (!token) {
                    toast.error("No token provided for password reset.");
                    return;
                }
                await handlePasswordReset({ newPassword: value.password, token })
            })
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className={cn("", className)} {...props}
        >
            <FieldGroup>
                <Field>
                    <form.Field
                        name="password"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                                    <Input
                                        id={field.name}
                                        type="password"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="********"
                                        autoComplete="off"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>

                <Button type="submit" variant="secondary" size="lg" disabled={isPending} className="cursor-pointer">
                    {isPending && <Loader2Icon className="animate-spin" />}
                    Reset Password
                </Button>

                <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}

export default ResetPasswordForm
