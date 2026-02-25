import { Skeleton } from '@/components/ui/skeleton'
import ProfileForm from '@/components/web/profile-form'
import { getSession } from '@/data/session'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
  loader: () => ({ session: getSession() })
})

const ProfileFormSkelton = () => {
  return (
    <div className='flex flex-col space-y-6'>
      <div className='space-y-3'>
        <Skeleton className='w-20 h-5' />
        <Skeleton className='w-full max-w-lg h-3' />
      </div>
      <div className='space-y-3'>
        <Skeleton className='w-20 h-3' />
        <Skeleton className='w-full max-w-lg h-10' />
      </div>
      <div className='flex items-center gap-4 max-w-lg'>
        <Skeleton className='size-20 rounded-full' />
        <div className='flex-1 space-y-3'>
          <Skeleton className='w-20 h-3' />
          <Skeleton className='w-full max-w-lg h-10' />
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Skeleton className='w-32 h-8' />
        <Skeleton className='w-28 h-8' />
      </div>
    </div>
  )
}

function RouteComponent() {
  const { session } = Route.useLoaderData()
  return <div className='flex flex-col max-w-xl'>
    <Suspense fallback={<ProfileFormSkelton />}>
      <ProfileForm sessionData={session} />
    </Suspense>
  </div>
}
