import { useState, useEffect } from 'react'
import { type FeedbackClient } from '../client/index'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Progress } from './components/ui/progress'
import { XIcon } from 'lucide-react'

import './styles/globals.css'

export interface FeedbackWidgetProps {
  client: FeedbackClient
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
      await props.client.sendFeedback(feedback)
      setSubmitted(true)
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
    return <Button onClick={() => setIsOpen(true)}>Feedback</Button>
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6 w-full max-w-md">
        <p className="text-center text-lg mb-4">Thank you for your feedback</p>
        <Progress value={progress} />
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border shadow-sm w-lg min-w-0 max-w-lg p-2"
    >
      <div className="flex items-center justify-between ml-2 mr-0">
        <h2 className="text-xl font-semibold">Give feedback on Tango</h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className=" rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 p-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            If you would like to receive updates on this
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            rows={4}
            placeholder="Your feedback..."
            className="resize-none w-full"
            style={{ fieldSizing: 'fixed' } as React.CSSProperties}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}
