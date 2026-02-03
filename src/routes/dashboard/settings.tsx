import { FieldSeparator } from '@/components/ui/field'
import DeleteAccount from '@/components/web/delete-account'
import EmailChangeForm from '@/components/web/email-change-form'
import PasswordForm from '@/components/web/password-form'
import { getSession } from '@/data/session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
  loader: () => getSession()
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return (
    <div className='flex flex-col gap-6 max-w-xl'>
      <EmailChangeForm />
      <FieldSeparator />
      <PasswordForm />
      <FieldSeparator />
      <DeleteAccount user={user} />
    </div>
  )
}
