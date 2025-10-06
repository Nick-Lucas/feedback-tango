import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})

function RouteComponent() {
  const { redirect: callbackURL } = Route.useSearch()

  const session = authClient.useSession()
  if (session.data) {
    return <Navigate to="/" replace />
  }
  console.log({ session })
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: 'github',
            callbackURL: callbackURL,
          })
        }}
      >
        Sign In with GitHub
      </Button>
    </div>
  )
}
