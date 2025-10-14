import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { authClient } from '@/lib/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import z from 'zod'
import { cn } from '@/lib/utils'
import { SafariSafeBubbleBackground } from '@/components/SafariSafeBubbleBackground'

export const Route = createFileRoute('/(signin)/signin')({
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

  return (
    <SafariSafeBubbleBackground interactive={true} className="min-h-screen">
      <SignInContent callbackURL={callbackURL} />
    </SafariSafeBubbleBackground>
  )
}

function SignInContent({ callbackURL }: { callbackURL?: string }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
      <Card className="p-8 px-12 bg-background/50 backdrop-blur-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">
            Let's Tango
          </h1>

          <p className="text-lg text-muted-foreground">
            Sign in to get started
          </p>

          <Button
            size="lg"
            className={cn(
              'mt-8 bg-[#24292e] hover:bg-[#24292e] active:bg-[#1b1f23] text-white',
              'shadow-[0_0_5px_rgba(255,255,255,0.15)] hover:shadow-[0_0_10px_rgba(255,255,255,0.25)] transition-shadow-bg'
            )}
            onClick={async () => {
              await authClient.signIn.social({
                provider: 'github',
                callbackURL: callbackURL,
              })
            }}
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Sign In with GitHub
          </Button>
        </div>
      </Card>
    </div>
  )
}
