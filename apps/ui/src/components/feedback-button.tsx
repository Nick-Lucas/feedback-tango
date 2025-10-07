import { createFeedbackClient } from '@feedback-thing/sdk/client'
import { FeedbackWidget } from '@feedback-thing/sdk/react'
import { useParams, useRouter } from '@tanstack/react-router'
import { useMemo } from 'react'

import '@feedback-thing/sdk/styles.css'

export function FeedbackButton() {
  const { invalidate } = useRouter()
  const maybeProjectId = useParams({ strict: false }).projectId
  const appliesToThisProject = !!maybeProjectId

  const feedbackProjectId =
    maybeProjectId ?? import.meta.env.VITE_SELF_FEEDBACK_PUBLIC_KEY

  const feedbackClient = useMemo(() => {
    if (!feedbackProjectId) {
      return null
    }

    return createFeedbackClient({
      endpoint:
        import.meta.env.VITE_SELF_FEEDBACK_ENDPOINT ??
        'http://localhost:3000/api/feedback',
      projectPublicKey: feedbackProjectId,
    })
  }, [feedbackProjectId])

  if (!feedbackClient) {
    return null
  }

  if (!appliesToThisProject) {
    // Disable for now when no projectId
    // In the future we'd want to enable this to get feedback about Feedback Thing itself
    return null
  }

  return (
    <div className="fixed bottom-4 right-4">
      <FeedbackWidget
        title={
          appliesToThisProject
            ? 'Test Feedback'
            : 'Feedback about Feedback Thing'
        }
        button={
          appliesToThisProject
            ? 'Test Feedback'
            : 'Feedback about Feedback Thing'
        }
        client={feedbackClient}
        onFeedbackSubmitted={invalidate}
      />
    </div>
  )
}
