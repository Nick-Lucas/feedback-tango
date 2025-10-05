import { type FeedbackClient } from '../client/index'
import { Button } from './components/ui/button'

import './styles/globals.css'

export interface FeedbackWidgetProps {
  client: FeedbackClient
}

export function FeedbackWidget(props: FeedbackWidgetProps) {
  return (
    <div>
      Feedback Widget
      <Button
        className=""
        onClick={async () => {
          await props.client.sendFeedback('Great job!')
        }}
      >
        Send
      </Button>
    </div>
  )
}
