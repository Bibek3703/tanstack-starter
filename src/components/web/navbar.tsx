import { Link } from '@tanstack/react-router'
import ModeToggle from './mode-toggle'
import { BotIcon } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export function Navbar() {
    const { data: session, isPending } = authClient.useSession()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("You have been logged out.")
                },
                onError: ({ error }) => {
                    toast.error(`Logout failed: ${error.message || "Something went wrong."}`)
                }
            }
        })
    }

    return (
        <nav className='sticky top-0 w-full p-4 flex items-center bg-background/80 backdrop-blur-sm border-b border-b-muted/20 z-50'>
            <div className='w-auto flex items-center gap-2'>
                <BotIcon />
                <span className='font-medium text-lg'>AI Crawler</span>
            </div>
            <div className='flex-1 flex justify-end gap-3 items-center'>
                <ModeToggle />
                {isPending ? null : session ? (
                    <>
                        <Button
                            variant='secondary'
                            onClick={handleSignOut}
                        >
                            Logout
                        </Button>
                        <Link to='/dashboard' className={buttonVariants()}>
                            Dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to='/login' className={buttonVariants({ variant: 'secondary' })}>
                            Login
                        </Link>
                        <Link to='/signup' className={buttonVariants()}>
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
