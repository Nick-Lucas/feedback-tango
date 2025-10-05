import { type FeedbackClient } from '../client/index.ts'
import { Button } from './components/ui/button.tsx'

import './styles/globals.css'

export interface FeedbackWidgetProps {
  client: FeedbackClient
}

export function FeedbackWidget(props: FeedbackWidgetProps) {
  return (
    <div>
      Feedback Widget
      <Button
        style={{
          backgroundColor: 'blue',
        }}
        onClick={async () => {
          await props.client.sendFeedback('Great job!')
        }}
      >
        Send
      </Button>
    </div>
  )
}
