import React from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { useForm } from '@tanstack/react-form'
import { emailChangeSchema, passwordChangeSchema } from '@/schemas/auth'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'
import useSettings from '@/hooks/use-settings'

function EmailChangeForm() {
    const { handleChangeEmail } = useSettings()
    const [isPending, startTransition] = React.useTransition()

    const form = useForm({
        defaultValues: {
            newEmail: "",
        },
        validators: {
            onSubmit: emailChangeSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                await handleChangeEmail(value)
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
                    <FieldLegend>Change Email</FieldLegend>
                    <FieldDescription>
                        Update your account email here. Make sure to use a valid email address.
                    </FieldDescription>
                    <FieldGroup>
                        <form.Field
                            name="newEmail"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>New Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            type="email"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="newemail@example.com"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                        <Field orientation="horizontal">
                            <Button type="submit">
                                {isPending && <Loader2Icon className="animate-spin" />}
                                Update Email
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

export default EmailChangeForm
