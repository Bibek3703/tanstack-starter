import { userInputSchema } from '@/schemas/user'
import { useForm } from '@tanstack/react-form'
import React, { use } from 'react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2Icon, UserIcon } from 'lucide-react'
import { updateUser } from '@/data/user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getAvatarColor } from '@/lib/auth-helpers'
import { getSession } from '@/data/session'

function ProfileForm({ sessionData }: { sessionData: ReturnType<typeof getSession> }) {
    const { user } = use(sessionData)
    const [isPending, startTransition] = React.useTransition()
    const [image, setImage] = React.useState<File | null>(null)

    const form = useForm({
        defaultValues: {
            name: user.name || "",
        },
        validators: {
            onSubmit: userInputSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                const formData = new FormData()
                formData.append("name", value.name)
                if (image) {
                    formData.append("image", image)
                }
                await updateUser({ data: formData })
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
                    <FieldLegend>Profile</FieldLegend>
                    <FieldDescription>
                        Update your profile information here.
                    </FieldDescription>
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Your Name"
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
                            <Avatar className="size-20">
                                <AvatarImage
                                    src={(image && URL.createObjectURL(image)) || user?.image || `https://api.dicebear.com/9.x/initials/svg?backgroundColor=${getAvatarColor(user.name)}&seed=${user.name}`}
                                    className="w-full h-full object-cover"
                                />
                                <AvatarFallback>
                                    <UserIcon />
                                </AvatarFallback>
                            </Avatar>
                            <Field>
                                <FieldLabel htmlFor="image">Image</FieldLabel>
                                <Input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setImage(e.target.files[0])
                                        }
                                    }}
                                    placeholder="Your Image"
                                    autoComplete="off"
                                />
                            </Field>
                        </Field>

                        <Field orientation="horizontal">
                            <Button type="submit">
                                {isPending && <Loader2Icon className="animate-spin" />}
                                Update Profile
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

export default ProfileForm
