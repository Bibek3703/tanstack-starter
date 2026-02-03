import ProfileForm from '@/components/web/profile-form'
import { getSession } from '@/data/session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
  loader: () => getSession()
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  return <div className='flex flex-col max-w-xl'>
    <ProfileForm user={user} />
  </div>
}
