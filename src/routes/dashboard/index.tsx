import { getSession } from '@/data/session'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
    component: RouteComponent,
    loader: () => getSession()
})

function RouteComponent() {
    return <div>Hello "/dashboard/"!</div>
}
