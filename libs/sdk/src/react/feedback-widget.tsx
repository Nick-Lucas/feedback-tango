import { useState, useEffect } from 'react'
import { type FeedbackClient } from '../client/index'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Progress } from './components/ui/progress'
import { XIcon } from 'lucide-react'

export interface FeedbackWidgetProps {
  client: FeedbackClient
  title?: string
  button?: string
  onFeedbackSubmitted?: () => void
}

export function FeedbackWidget(props: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (submitted) {
      // Animate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 100)

      // Close modal after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setProgress(0)
        setEmail('')
        setFeedback('')
      }, 5000)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [submitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await props.client.sendFeedback(email, feedback)
      setSubmitted(true)
      props.onFeedbackSubmitted?.()
    } catch (error) {
      console.error('Failed to send feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (feedback.trim()) {
        void handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSubmitted(false)
    setProgress(0)
    setEmail('')
    setFeedback('')
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        {props.button ?? 'Feedback'}
      </Button>
    )
  }

  if (submitted) {
    return (
      <div className="tangosdk:rounded-lg tangosdk:border tangosdk:shadow-sm tangosdk:p-6 tangosdk:w-full tangosdk:max-w-md">
        <p className="tangosdk:text-center tangosdk:text-lg tangosdk:mb-4">
          Thank you for your feedback
        </p>
        <Progress value={progress} />
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="tangosdk:bg-background tangosdk:rounded-lg tangosdk:border tangosdk:shadow-sm tangosdk:p-2 tangosdk:w-80 tangosdk:max-w-80"
    >
      <div className="tangosdk:flex tangosdk:items-center tangosdk:justify-between tangosdk:ml-2 tangosdk:mr-0">
        <h2 className="tangosdk:text-xl tangosdk:font-semibold">
          {props.title ?? 'Give feedback'}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="tangosdk:rounded-sm tangosdk:opacity-70 tangosdk:transition-opacity hover:tangosdk:opacity-100 focus:tangosdk:outline-none focus:tangosdk:ring-2 focus:tangosdk:ring-offset-2"
        >
          <XIcon className="tangosdk:h-4 tangosdk:w-4" />
        </Button>
      </div>

      <div className="tangosdk:space-y-4 tangosdk:p-2">
        <div className="tangosdk:space-y-2">
          <Label htmlFor="email" className="tangosdk:text-sm">
            Email (optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="tangosdk:space-y-2">
          <Label htmlFor="feedback" className="tangosdk:text-sm">
            Feedback
          </Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            rows={4}
            placeholder="Your feedback..."
            className="tangosdk:resize-none tangosdk:w-full"
            style={{ fieldSizing: 'fixed' } as React.CSSProperties}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="tangosdk:w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}
