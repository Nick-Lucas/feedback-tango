import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient({
  baseURL: 'http://localhost:3000/api/auth/',
})

export const Route = createFileRoute('/cli/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: 'github',
            callbackURL: location.origin + '/cli/signin/complete',
          })
        }}
      >
        Sign In with GitHub
      </Button>
    </div>
  )
}
