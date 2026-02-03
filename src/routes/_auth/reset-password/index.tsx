import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ResetPasswordForm from '@/components/web/reset-password-form'
import { resetPasswordSearchParamsSchema } from '@/schemas/searchParams'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/reset-password/')({
    component: RouteComponent,
    validateSearch: resetPasswordSearchParamsSchema,
})

function RouteComponent() {
    const { token } = Route.useSearch()
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Reset Password</CardTitle>
                <CardDescription>
                    Enter your email and password to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResetPasswordForm token={token} />
            </CardContent>
        </Card>
    )
}
