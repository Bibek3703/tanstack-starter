import { cn } from '@/lib/utils'
import { todoColumnSchema, todoFormSchema } from '@/schemas/todo'
import { useForm } from '@tanstack/react-form'
import React, { use } from 'react'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { TodoStatuses } from '@/db/schema'
import { Button } from '../ui/button'
import { useCreateTodo, useUpdateTodo } from '@/hooks/use-todos'
import { Loader2Icon } from 'lucide-react'
import z from 'zod'

const items: { label: string; value: typeof TodoStatuses[number] }[] = TodoStatuses.map((status) => ({
    label: status,
    value: status
}))

function AddTodoForm({
    className,
    onSubmitTodo = () => { },
    onCancel = () => { },
    todo,
    ...props
}: React.ComponentProps<"form"> & {
    todo?: z.infer<typeof todoColumnSchema>,
    onSubmitTodo?: () => void,
    onCancel?: () => void
}) {
    const { mutateAsync: addTodo } = useCreateTodo()
    const { mutateAsync: updateTodo } = useUpdateTodo()
    const [isPending, startTransition] = React.useTransition()
    const form = useForm({
        defaultValues: {
            title: todo?.title || "",
            status: todo?.status || "PENDING",
        },
        validators: {
            onSubmit: todoFormSchema
        },
        onSubmit: ({ value }) => {
            startTransition(async () => {
                if (todo) {
                    await updateTodo({ ...value, id: todo.id })
                    onSubmitTodo()
                    return
                }
                await addTodo(value as z.infer<typeof todoFormSchema>)
                form.reset()
                onSubmitTodo()
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
                    name="title"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    placeholder="New todo title"
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
                    name="status"
                    children={(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                                <Select
                                    items={items}
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value.toLowerCase()}
                                    onValueChange={(val) => field.handleChange(val as typeof TodoStatuses[number])}
                                    aria-invalid={isInvalid}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue onBlur={field.handleBlur} className="capitalize" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectGroup>
                                            <SelectLabel>Statuses</SelectLabel>
                                            {items.map((item) => (
                                                <SelectItem key={item.value} value={item.value} className="capitalize">
                                                    {item.label.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        )
                    }}
                />
                <Field orientation="horizontal">
                    <Button type="submit"
                        className="flex-1"
                        disabled={isPending}
                    >
                        {isPending && <Loader2Icon className="animate-spin" />}
                        {todo ? 'Update' : 'Create'} Todo
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                            form.reset()
                            onCancel()
                        }}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </Field>
            </FieldGroup>
        </form >
    )
}

export default AddTodoForm
