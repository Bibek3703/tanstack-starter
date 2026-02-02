import { Link } from '@tanstack/react-router'
import ModeToggle from './mode-toggle'
import { Button, buttonVariants } from '../ui/button'
import { authClient } from '@/lib/auth-client'
import useAuth from '@/hooks/use-auth'

export function Navbar() {
    const { data: session, isPending } = authClient.useSession()
    const { handleSignOut } = useAuth()

    return (
        <nav className='sticky top-0 w-full p-4 flex items-center bg-background/80 backdrop-blur-sm border-b border-b-muted/20 z-50'>
            <div className='w-auto flex items-center gap-2'>
                <img src='https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683914713/tags/tanstack.png' alt='TanStack Logo' className='w-8 h-8' />
                <span className='font-medium text-lg'>TanStack Starter</span>
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
