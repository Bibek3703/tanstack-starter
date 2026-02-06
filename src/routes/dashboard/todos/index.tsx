import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AddTodoForm from '@/components/web/add-todo-form'
import DataTable from '@/components/web/data-table'
import DeleteDialog from '@/components/web/delete-dialog'
import DragHandle from '@/components/web/drag-handle'
import { useDebounce } from '@/hooks/use-debounce'
import { useDeleteTodo, useDeleteTodos, useUserTodos } from '@/hooks/use-todos'
import { todoColumnSchema } from '@/schemas/todo'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2Icon, MoreHorizontal } from 'lucide-react'
import React from 'react'
import z from 'zod'

export const Route = createFileRoute('/dashboard/todos/')({
    component: RouteComponent,
})

const columns: ColumnDef<z.infer<typeof todoColumnSchema>>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected())
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            return <div className='max-w-xl whitespace-break-spaces'>{row.original.title}</div>
        },
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <Badge>{row.original.status}</Badge>
        },
        enableHiding: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const todo = row.original
            const [open, setOpen] = React.useState(false)
            const [deleteOpen, setDeleteOpen] = React.useState(false)
            const { mutateAsync: deleteTodo, isPending } = useDeleteTodo()

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            } />
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => setOpen(true)}
                                >
                                    Edit Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                                    Delete Todo
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TodoFormDialog todo={todo} open={open} setOpen={setOpen} />
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        showTrigger={false}
                        onConfirm={() => deleteTodo(todo.id)}
                    />
                </>
            )
        },
    },
]

function TodoFormDialog({ open, setOpen, todo }: { todo?: z.infer<typeof todoColumnSchema>, open: boolean, setOpen: (open: boolean) => void }) {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Todo Form</DialogTitle>
                    <DialogDescription>
                        Add a new todo item. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <AddTodoForm
                    todo={todo}
                    onSubmitTodo={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}



function RouteComponent() {

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [searchQuery, setSearchQuery] = React.useState('')
    const [open, setOpen] = React.useState(false)

    const { isLoading: searchInputLoading, debouncedValue } = useDebounce(searchQuery, 500)

    const { data, isFetching, isLoading } = useUserTodos({
        ...pagination,
        query: debouncedValue
    })

    const { mutateAsync: deleteTodos } = useDeleteTodos()

    return <div className='max-w-full'>
        <DataTable
            data={data?.todos as unknown as z.infer<typeof todoColumnSchema>[] || []}
            rowCount={data?.todosCount}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            isLoading={isFetching || isLoading}
            searchInputPlaceholder='Search title...'
            searchQuery={searchQuery}
            onSearchQueryChange={(value) => setSearchQuery(value)}
            searchInputLoading={searchInputLoading}
            onAddNew={() => setOpen(true)}
            onDeleteItems={(ids) => deleteTodos(ids as string[])}
        />
        <TodoFormDialog
            open={open}
            setOpen={(open) => {
                setSearchQuery("")
                setOpen(open)
            }}
        />
    </div>
}
