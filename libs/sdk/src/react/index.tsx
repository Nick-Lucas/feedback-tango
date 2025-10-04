import { type FeedbackClient } from '../client/index.ts'

export interface FeedbackWidgetProps {
  client: FeedbackClient
}

export function FeedbackWidget(props: FeedbackWidgetProps) {
  return (
    <div>
      Feedback Widget
      <button
        style={{
          backgroundColor: 'blue',
        }}
        onClick={async () => {
          await props.client.sendFeedback('Great job!')
        }}
      >
        Send
      </button>
    </div>
  )
}
