import { Feedbacks } from '@feedback-thing/db'
import { db, type App } from '../app.ts'
import { z } from 'zod'
import { findAgentUser } from './agent-user.ts'
import { checkFeedbackSafety } from './feedback-safety.ts'
import { handleFeedbackWithAgent } from './feedback-agent.ts'

const FeedbackSubmission = z.object({
  email: z.email().max(100).optional(),
  feedback: z.string().min(1).max(5000),
})

export function addFeedback(app: App) {
  // TODO:
  // We probably want to commit all feedback to a raw table, then process for safety and feature association later
  // This would allow us to retry failed feedback processing, and also batch process feedback for feature association
  // It would also allow us to store unsafe feedback for later review
  // The tradoff is the feedback UI wouldn't be able to give any feedback to the user, but fast submission is probably the best UX anyway
  app.post('/api/feedback', async (c) => {
    console.log('[/api/feedback] received request')

    // TODO: this is just the project ID currently, should use the better-auth api public key
    // plugin instead which would support rate limiting. prefixes, and permissions out the box
    const projectId = c.req.header('X-Project-Key')
    if (!projectId) {
      return c.json({ error: 'Missing X-Project-ID header' }, 400)
    }
    console.log('[/api/feedback] projectId', projectId)

    const project = await db.query.Projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, projectId),
    })
    if (!project) {
      return c.json({ error: 'Invalid Project ID' }, 400)
    }
    console.log('[/api/feedback] project found:', project.name)

    const agentUserId = await findAgentUser()
    console.log('[/api/feedback] agent user ID:', agentUserId)

    const body = await c.req.json()
    const parsed = FeedbackSubmission.safeParse(body)
    if (!parsed.success) {
      return c.json(
        { error: 'Invalid request', details: z.treeifyError(parsed.error) },
        400
      )
    }
    console.log('[/api/feedback] parsed submission:', parsed.data)

    const safetyGrade = await checkFeedbackSafety(parsed.data.feedback)
    console.log('[/api/feedback] safety grade:', safetyGrade)

    if (safetyGrade.object.outcome === 'unsafe') {
      // TODO: log the feedback in a raw form somewhere for later review
      console.log('Rejected feedback:', {
        feedback: parsed.data.feedback,
        reason: safetyGrade.object.reason,
      })
      return c.json({ error: 'Invalid Submission' }, 400)
    }

    const feature = await handleFeedbackWithAgent({
      projectId,
      agentUserId,
      feedback: parsed.data.feedback,
    })
    console.log('[/api/feedback] feature result:', feature)

    if (feature.type === 'error') {
      console.error('Failed to determine feature for feedback:', feature.error)
      return c.json({ error: 'Failed to process feedback' }, 500)
    }

    await db.insert(Feedbacks).values({
      projectId,
      featureId: feature.featureId,
      feedback: parsed.data.feedback,

      // TODO: generate a user ID from the email address if possible or use a dummy user
      createdBy: parsed.data.email ?? 'anonymous',
    })

    console.log('Feedback stored successfully')

    return c.json({ status: 'ok' })
  })
}
