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
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { signupSchema } from "@/schemas/auth"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signupSchema
        },
        onSubmit: async ({ value }) => {
            if (!value) return
            await authClient.signUp.email({
                name: value.fullName,
                email: value.email,
                password: value.password,
                // callbackURL: "/dashboard",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signup successful! Please check your email to verify your account.")
                        navigate({ to: "/" })
                    },
                    onError: (error) => {
                        toast.error(`Signup failed: ${error instanceof Error ? error.message : "Something went wrong."}`)
                    }
                }
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
                <Field >
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={(state: any) => {
                            const [canSubmit, isSubmitting] = state as [boolean, boolean]
                            return (
                                <Button type="submit" variant="secondary" size="lg" disabled={!canSubmit || isSubmitting} className="cursor-pointer">
                                    {isSubmitting ? "Loading" : "Create Account"}
                                </Button>
                            )
                        }}
                    />
                    <FieldDescription className="text-center">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
