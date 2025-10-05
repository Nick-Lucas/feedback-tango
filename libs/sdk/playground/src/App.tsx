import { FeedbackWidget } from '../../src/react'
import { createFeedbackClient } from '../../src/client'

const client = createFeedbackClient({
  endpoint: 'https://localhost:3000/api/feedback',
  projectPublicKey: 'test_public_key',
})

export function App() {
  return (
    <>
      <FeedbackWidget client={client} />
    </>
  )
}
