import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTable from '@/components/web/data-table'
import DragHandle from '@/components/web/drag-handle'
import { useDebounce } from '@/hooks/use-debounce'
import { useUserTodos } from '@/hooks/use-todos'
import { todoColumnSchema } from '@/schemas/todo'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
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
]

function RouteComponent() {

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [searchQuery, setSearchQuery] = React.useState('')

    const { isLoading: searchInputLoading, debouncedValue } = useDebounce(searchQuery, 500)

    const { data, isFetching, isLoading } = useUserTodos({
        ...pagination,
        query: debouncedValue
    })

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
        />
    </div>
}
