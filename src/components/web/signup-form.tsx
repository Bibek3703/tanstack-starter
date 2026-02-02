import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { signupSchema } from "@/schemas/auth"
import useAuth from "@/hooks/use-auth"
import { Loader2Icon } from "lucide-react"
import React from "react"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { handleSignUp } = useAuth()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signupSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                handleSignUp(value)
            })
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className={cn("", className)}
            {...props}
        >
            <FieldGroup>
                <form.Field
                    name="fullName"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="John Doe"
                                    autoComplete="off"
                                />
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        )
                    }}
                />
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
                <Field>
                    <form.Field
                        name="password"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                    Login
                </Button>
                <FieldDescription className="text-center">
                    Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}
