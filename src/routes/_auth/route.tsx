import { FieldDescription } from '@/components/ui/field'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link to="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
                        <img src='https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683914713/tags/tanstack.png' alt='TanStack Logo' className='w-full h-full object-cover' />
                    </div>
                    TanStack Starter
                </Link>
                <div className="flex flex-col gap-6">
                    <Outlet />
                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
