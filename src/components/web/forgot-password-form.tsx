import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { forgotPasswordSchema } from '@/schemas/auth'
import { useForm } from '@tanstack/react-form'
import React from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'

function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const { handleRequestPasswordReset } = useAuth()
    const [isPending, startTransition] = React.useTransition()
    const form = useForm({
        defaultValues: {
            email: "",
        },
        validators: {
            onSubmit: forgotPasswordSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                await handleRequestPasswordReset(value.email)
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
                <form.Field
                    name="email"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="john@example.com"
                                    autoComplete="off"
                                />
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        )
                    }}
                />
                <Button type="submit" variant="secondary" size="lg" disabled={isPending} className="cursor-pointer">
                    {isPending && <Loader2Icon className="animate-spin" />}
                    Send Password Reset Email
                </Button>

                <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}

export default ForgotPasswordForm
