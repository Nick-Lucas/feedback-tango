import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { authClient } from '@/lib/auth'
import {
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Infinity as InfinityIcon,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { GradientBackground } from '@/components/gradient-background'
import { TangoLogo } from '@/components/tango-logo'

export const Route = createFileRoute('/(public)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const session = authClient.useSession()
  const isAuthenticated = !!session.data

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="px-4 fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xs">
        <div className="container flex h-16 items-center justify-between justify-self-center">
          <TangoLogoName />

          <Button asChild variant={isAuthenticated ? 'default' : 'outline'}>
            <Link to={isAuthenticated ? '/projects' : '/signin'}>
              {isAuthenticated ? 'Go to App' : 'Sign In'}
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section with BubbleBackground */}
      <GradientBackground className="h-screen relative ">
        <div className="relative z-10 flex flex-col h-screen items-center justify-center px-4">
          <div
            className={cn(
              'flex flex-col items-center',
              'mx-auto max-w-4xl rounded-3xl bg-background/30 text-center shadow-2xl backdrop-blur-md',
              'py-8 px-4 md:p-12'
            )}
          >
            <Badge className="mb-6 border-0 bg-gradient-to-br from-primary to-accent-foreground px-5 py-2 text-sm">
              <Sparkles className="mr-1 size-3.5" />
              AI-Powered Feedback
            </Badge>

            <h1
              className={cn(
                'mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text',
                'max-w-150 text-4xl lg:text-6xl font-bold tracking-tight text-transparent drop-shadow-lg'
              )}
            >
              Make Every Customer Voice Count!
            </h1>

            <p className="max-w-150 mb-10 text-md md:text-lg text-foreground/80 drop-shadow-md">
              Transform chaos into clarity. Tango helps you collect, analyze,
              and act on customer feedback, turning the qualitative into
              quantitative.
              {/* Transform chaos into clarity. Tango helps you collect, analyze,
              and act on customer feedback with the power of AI, turning every
              voice into actionable insights. */}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="group">
                <Link to={isAuthenticated ? '/projects' : '/signin'}>
                  Get Started
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault()

                    scrollToFeatures()
                  }}
                >
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient fade overlay */}
        <div
          className={cn(
            ' absolute inset-x-0 bottom-0 z-[49] h-49 bg-gradient-to-t from-background via-background/50 to-transparent',
            'flex items-end justify-center pb-10'
          )}
        >
          <div className="mt-16 flex justify-center z-49">
            <button
              onClick={(e) => {
                e.preventDefault()
                scrollToFeatures()
              }}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Scroll down to features"
            >
              <ChevronDown className="size-8" />
            </button>
          </div>
        </div>
      </GradientBackground>

      <main className="px-4">
        {/* Feature Section 1: Make every user's voice heard */}
        <Section id="features">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <Badge variant="outline" className="mb-4 w-fit">
                <InfinityIcon className="mr-1.5 size-3.5" />
                Unlimited Scale
              </Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                Make every user's voice heard
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Tango can process an unlimited amount of customer insight,
                ensuring that no feedback is ever lost or ignored. Whether you
                receive 10 or 10,000 pieces of feedback daily, our platform
                scales effortlessly to meet your needs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Process unlimited feedback from any source
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Never miss a customer comment or suggestion
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Automatic prioritization based on volume and sentiment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Real-time processing with instant insights
                  </span>
                </li>
              </ul>
            </div>
            <CardImage
              src="/landing/user-voices.svg"
              alt="Infinite user voices being processed"
            />
          </div>
        </Section>

        {/* Feature Section 2: Automatic feedback clustering */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <CardImage
              src="/landing/user-voices-clustered.svg"
              alt="Smart clustering of feedback topics"
            />
            <div className="order-1 flex flex-col justify-center lg:order-2">
              <Badge variant="outline" className="mb-4 w-fit">
                <Sparkles className="mr-1.5 size-3.5" />
                AI-Powered Organization
              </Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                Automatic feedback clustering
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Our advanced AI algorithms automatically group similar feedback
                together, revealing patterns and trends you might have missed.
                Spend less time organizing and more time acting on insights.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Intelligent grouping of related feedback topics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Identify emerging trends before they become critical
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Automatic tagging and categorization
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Discover hidden connections across feedback channels
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Feature Section 3: Turn qualitative into quantitative */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <Badge variant="outline" className="mb-4 w-fit">
                <TrendingUp className="mr-1.5 size-3.5" />
                Data-Driven Insights
              </Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                Turn qualitative feedback into quantitative data
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Transform subjective customer opinions into concrete, measurable
                metrics. Our platform extracts sentiment scores, frequency
                analysis, and trend data from unstructured feedback, giving you
                the numbers you need to make informed decisions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Sentiment analysis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Track feedback volume and trends over time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Generate reports that executives understand
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Export data for deeper analysis in your favorite tools
                  </span>
                </li>
              </ul>
            </div>
            <CardImage
              src="/landing/user-voices-stats.svg"
              alt="Analytics dashboard showing quantitative data"
            />
          </div>
        </Section>

        {/* Feature Section 4: AI-first */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <CardImage
              src="/landing/ai-brain.svg"
              alt="AI-powered technology processing feedback"
            />
            <div className="order-1 flex flex-col justify-center lg:order-2">
              <Badge variant="outline" className="mb-4 w-fit">
                <Zap className="mr-1.5 size-3.5" />
                Next-Generation Technology
              </Badge>
              <h2 className="mb-4 text-4xl font-bold tracking-tight">
                AI-first approach
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Built from the ground up with artificial intelligence at its
                core, Tango doesn't just apply AI as an afterthought—it's
                fundamental to how we process, understand, and derive value from
                your customer feedback.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Natural language understanding that improves over time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Contextual analysis that understands intent and emotion
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Predictive insights to anticipate customer needs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  <span className="text-muted-foreground">
                    Continuous modelling of your software's unique features
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <section className="container py-6 md:py-24">
          <Card className="border-2 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10">
            <CardContent className="flex flex-col items-center py-4 md:py-16 text-center">
              <h2 className="mb-4 text-2xl md:text-4xl font-bold tracking-tight">
                Ready to transform your feedback?
              </h2>
              <p className="mb-8 max-w-2xl text-md md:text-lg text-muted-foreground">
                Join teams who are already making better decisions with Tango.
                Start processing your customer feedback intelligently today.
              </p>

              <Button asChild size="lg" className="group">
                <Link to={isAuthenticated ? '/projects' : '/signin'}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <TangoLogoName />

              <p className="text-sm text-muted-foreground">
                © 2025 Tango. Making every voice count.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

function CardImage(props: { src: string; alt: string }) {
  // const isMobile = useIsMobile()
  // if (isMobile) {
  //   return null
  // }

  return (
    <div className="relative hidden lg:flex items-center justify-center opacity-75">
      {/* <Noise /> */}
      <div className="w-full overflow-hidden rounded-xl  shadow-lg">
        <img
          src={props.src}
          alt={props.alt}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  )
}

function TangoLogoName() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center [&_svg]:text-primary">
        <TangoLogo />
      </div>

      <div className="relative">
        <span className="text-xl font-bold">Tango</span>

        <div
          className="absolute -right-4 -top-1 rotate-12 bg-destructive px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm rounded-sm opacity-50"
          aria-hidden
        >
          BETA
        </div>
        <div className="absolute -right-4 -top-1 rotate-25 bg-destructive px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm rounded-sm">
          BETA
        </div>
      </div>
    </div>
  )
}

function Section(props: { id?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="container max-w-7xl py-6 lg:py-24"
      style={{ contentVisibility: 'auto' }}
    >
      {props.children}
    </section>
  )
}

function scrollToFeatures() {
  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
}
