import React from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { useForm } from '@tanstack/react-form'
import { passwordChangeSchema } from '@/schemas/auth'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'
import useSettings from '@/hooks/use-settings'

function PasswordForm() {
    const { handleChangePassword } = useSettings()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm({
        defaultValues: {
            newPassword: "",
            currentPassword: "",
        },
        validators: {
            onSubmit: passwordChangeSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                await handleChangePassword(value)
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
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Change Password</FieldLegend>
                    <FieldDescription>
                        Update your account password here. Make sure to choose a strong
                        password that you haven't used before.
                    </FieldDescription>
                    <FieldGroup>
                        <form.Field
                            name="currentPassword"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
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
                        <Field>
                            <form.Field
                                name="newPassword"
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

                        <Field orientation="horizontal">
                            <Button type="submit">
                                {isPending && <Loader2Icon className="animate-spin" />}
                                Update Password
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => form.reset()}
                            >
                                Cancel
                            </Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </form>
    )
}

export default PasswordForm
