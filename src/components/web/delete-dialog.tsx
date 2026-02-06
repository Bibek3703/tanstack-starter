import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { Input } from '../ui/input'

interface DeleteDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    title?: string
    description?: string
    triggerText?: string
    triggerComponent?: React.ReactElement
    showTrigger?: boolean
    onConfirm: () => void
}
function DeleteDialog({ open, onOpenChange, title, description, triggerText, onConfirm, triggerComponent, showTrigger = true }: DeleteDialogProps) {
    const [inputText, setInputText] = React.useState("")
    const [isPending, startTransition] = React.useTransition()

    const handleOnConfirm = () => {
        if (inputText === "Delete") {
            startTransition(async () => {
                await onConfirm()
                onOpenChange && onOpenChange(false)
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger render={showTrigger ? triggerComponent || <Button variant="destructive">
                <Trash2Icon />
                <span className="hidden lg:inline">{triggerText || "Delete"}</span>
            </Button> : undefined}
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description || "This action cannot be undone. This will permanently delete your account from our servers. Write 'Delete' to confirm."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    placeholder="Type 'Delete' to confirm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={inputText !== "Delete" || isPending} onClick={handleOnConfirm}>
                        {isPending && <Loader2Icon className="animate-spin mr-2" />}
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog
