import React, { use } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Field, FieldError, FieldGroup } from '../ui/field'
import { useForm } from '@tanstack/react-form'
import { deleteAccountSchema } from '@/schemas/auth'
import { Input } from '../ui/input'
import useSettings from '@/hooks/use-settings'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { getSession } from '@/data/session'

function DeleteAccount({ sessionData }: { sessionData: ReturnType<typeof getSession> }) {
    const { user } = use(sessionData)
    const { handleDeleteAccount } = useSettings()
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()

    const form = useForm({
        defaultValues: {
            email: "",
        },
        validators: {
            onSubmit: deleteAccountSchema
        },
        onSubmit: ({ value }) => {
            if (value.email !== user.email) {
                toast.error("The email you entered does not match your account email.")
                return
            }
            startTransition(async () => {
                await handleDeleteAccount()
                setOpen(false)
            })
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button variant="destructive" type='button'>
                    Delete Account
                </Button>
            }
            />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone. Copy your email address into the field below to confirm.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <Input
                                            id={field.name}
                                            type="email"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="account@example.com"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />

                    </FieldGroup>
                    <DialogFooter className='mt-4'>
                        <DialogClose render={<Button variant="outline" type="button" onClick={() => form.reset()}>Cancel</Button>} />
                        <Button variant="destructive" type="submit">
                            {isPending && <Loader2Icon className="animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default DeleteAccount
