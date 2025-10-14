import {
  BubbleBackground,
  type BubbleBackgroundProps,
} from './ui/shadcn-io/bubble-background'
import { GradientBackground } from './animate-ui/components/backgrounds/gradient'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { createIsomorphicFn } from '@tanstack/react-start'

type SafariSafeBubbleBackgroundProps = BubbleBackgroundProps

const isSafari = createIsomorphicFn()
  .client(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()

    const isSafariBrowser =
      userAgent.includes('safari') && !userAgent.includes('chrome')

    const isIOS = /iphone|ipad|ipod/.test(userAgent)

    return isSafariBrowser || isIOS
  })
  .server(() => {
    const headers = getRequestHeaders()
    const userAgent = headers.get('user-agent')?.toLowerCase() ?? ''

    const isSafariBrowser =
      userAgent.includes('safari') && !userAgent.includes('chrome')

    const isIOS = /iphone|ipad|ipod/.test(userAgent)

    return isSafariBrowser || isIOS
  })

export function SafariSafeBubbleBackground(
  props: SafariSafeBubbleBackgroundProps
) {
  if (isSafari()) {
    const { className, children } = props

    return (
      <GradientBackground
        transition={{
          duration: 2,
        }}
        className={className}
      >
        {children}
      </GradientBackground>
    )
  }

  return <BubbleBackground {...props} />
}
