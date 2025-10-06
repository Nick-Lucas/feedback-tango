import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

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
