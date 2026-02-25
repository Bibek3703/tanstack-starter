import { FieldSeparator } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteAccount from '@/components/web/delete-account'
import EmailChangeForm from '@/components/web/email-change-form'
import PasswordForm from '@/components/web/password-form'
import { getSession } from '@/data/session'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
  loader: () => ({ session: getSession() })
})

const DeleteButtonSkelton = () => {
  return <Skeleton className='w-full h-10 bg-destructive/10' />
}

function RouteComponent() {
  const { session } = Route.useLoaderData()
  return (
    <div className='flex flex-col gap-6 max-w-xl'>
      <EmailChangeForm />
      <FieldSeparator />
      <PasswordForm />
      <FieldSeparator />
      <Suspense fallback={<DeleteButtonSkelton />}>
        <DeleteAccount sessionData={session} />
      </Suspense>
    </div>
  )
}
