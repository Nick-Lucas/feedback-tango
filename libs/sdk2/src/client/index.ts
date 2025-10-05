export interface FeedbackClientOpts {
  endpoint: string
  projectPublicKey: string
}

export function createFeedbackClient(opts: FeedbackClientOpts) {
  const uri = new URL(opts.endpoint)

  return {
    sendFeedback: async (feedback: string) => {
      console.log('Sending feedback:', feedback)

      const result = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Project-Key': opts.projectPublicKey,
        },
        body: JSON.stringify({ feedback }),
      })

      if (!result.ok) {
        throw new Error(`Failed to send feedback: ${result.statusText}`)
      }
    },
  }
}

export type FeedbackClient = ReturnType<typeof createFeedbackClient>
