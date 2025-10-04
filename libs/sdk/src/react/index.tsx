import { sendFeedback } from '../client/index.ts'

export function FeedbackWidget() {
  return (
    <div>
      Feedback Widget
      <button
        onClick={() => {
          sendFeedback('Great app!')
        }}
      >
        Send
      </button>
    </div>
  )
}
