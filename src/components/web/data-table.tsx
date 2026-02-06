import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
    Table as TanstackTable,
    PaginationState,
    OnChangeFn
} from "@tanstack/react-table"
import React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconLayoutColumns, IconPlus } from '@tabler/icons-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "../ui/pagination"
import { BookmarkIcon, Loader2Icon, Search, Trash2Icon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { Skeleton } from "../ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import DeleteDialog from "./delete-dialog"

interface DataTableProps<TData extends { id: string | number }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowCount?: number
    pagination?: PaginationState
    setPagination?: OnChangeFn<PaginationState>
    isLoading?: boolean
    searchInputPlaceholder?: string
    searchInputLoading?: boolean
    searchQuery?: string
    onSearchQueryChange?: (value: string) => void
    onAddNew?: () => void
    onDeleteItems?: (selectedIds: (string | number)[]) => void
}

function DraggableRow<TData extends { id: string | number }>({ row }: { row: Row<TData> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })
    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

function TablePagination<TData>({ table }: { table: TanstackTable<TData> }) {

    const currentPage = table.getState().pagination.pageIndex + 1
    const pageCount = table.getPageCount()
    const maxVisiblePages = 3

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1)
        const adjustedStart = Math.max(1, endPage - maxVisiblePages + 1)

        if (adjustedStart > 1) {
            pages.push(1)
            if (adjustedStart > 2) pages.push('...')
        }

        for (let i = adjustedStart; i <= endPage; i++) {
            pages.push(i)
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) pages.push('...')
            pages.push(pageCount)
        }

        return pages
    }

    return (
        <Pagination className="w-auto">
            <PaginationContent className="gap-1">
                <PaginationItem>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        title="First page"
                    >
                        <IconChevronsLeft className="h-4 w-4" />
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        title="Previous page"
                    >
                        <IconChevronLeft className="h-4 w-4" />
                    </Button>
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : "outline"}
                                className="h-8 w-8 p-0 text-xs"
                                onClick={() => table.setPageIndex((page as number) - 1)}
                            >
                                {page}
                            </Button>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        title="Next page"
                    >
                        <IconChevronRight className="h-4 w-4" />
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(pageCount - 1)}
                        disabled={!table.getCanNextPage()}
                        title="Last page"
                    >
                        <IconChevronsRight className="h-4 w-4" />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

function PaginationBar<TData>({ table }: { table: TanstackTable<TData> }) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-6">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="hidden items-center gap-2 xl:flex w-auto">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                    Rows per page
                </Label>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
            </div>
            <TablePagination table={table} />
        </div>
    )
}

function DataTable<TData extends { id: string | number }, TValue>({
    columns,
    data: initialData,
    pagination = {
        pageIndex: 0,
        pageSize: 10
    },
    setPagination,
    rowCount = 0,
    isLoading = false,
    searchInputPlaceholder = "Search...",
    searchInputLoading = false,
    searchQuery = "",
    onSearchQueryChange = () => { },
    onAddNew = () => { },
    onDeleteItems = () => { },
}: DataTableProps<TData, TValue>) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [open, setOpen] = React.useState<boolean>(false)
    // const [pagination, setPagination] = React.useState({
    //     pageIndex: 0,
    //     pageSize: 10,
    // })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    React.useEffect(() => {
        if (initialData.length > 0 && !isLoading) {
            setData(initialData)
        }
    }, [initialData])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        rowCount,
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="w-full max-w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <InputGroup className="max-w-sm">
                    <InputGroupInput
                        placeholder={searchInputPlaceholder}
                        value={searchQuery}
                        onChange={(event) =>
                            onSearchQueryChange(event.target.value)
                        }
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    {searchInputLoading && <InputGroupAddon align="inline-end">
                        <Loader2Icon className="animate-spin size-3.5" />
                    </InputGroupAddon>}
                </InputGroup>
                <div className="flex items-center gap-2 ml-auto">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && <DeleteDialog
                        open={open}
                        onOpenChange={setOpen}
                        onConfirm={() => onDeleteItems(table.getFilteredSelectedRowModel().rows.map((row) => row.original.id))}
                    />}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={<Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>} />
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={onAddNew}>
                        <IconPlus />
                        <span className="hidden lg:inline">Add New</span>
                    </Button>
                </div>
            </div>
            <PaginationBar table={table} />
            <div className="overflow-hidden rounded-lg border max-w-full">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className="w-full bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="**:data-[slot=table-cell]:first:w-8">
                            {isLoading ?
                                Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => {
                                    return (<TableRow key={index}>
                                        <TableCell
                                            key={index}
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <Skeleton className="bg-muted/70 w-full h-full" />
                                        </TableCell>
                                    </TableRow>
                                    )
                                }
                                ) : table.getRowModel().rows?.length && table.getRowModel().rows.length > 0 ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <Empty>
                                                <EmptyHeader>
                                                    <EmptyMedia variant="icon">
                                                        <BookmarkIcon />
                                                    </EmptyMedia>
                                                    <EmptyTitle>No Todos Yet</EmptyTitle>
                                                    <EmptyDescription>
                                                        You haven&apos;t created any todos yet. Get started by creating
                                                        your first todo.
                                                    </EmptyDescription>
                                                </EmptyHeader>
                                                <EmptyContent className="flex-row justify-center gap-2">
                                                    <Button>
                                                        Create Todo
                                                    </Button>
                                                </EmptyContent>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <PaginationBar table={table} />
        </div>
    )
}

export default DataTable
