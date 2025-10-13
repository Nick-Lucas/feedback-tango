import { RawFeedbacks } from '@feedback-thing/db'
import { db, type App } from '../app.ts'
import { z } from 'zod'

const FeedbackSubmission = z.object({
  email: z.email().max(100).optional(),
  feedback: z.string().min(1).max(5000),
})

export function addFeedback(app: App) {
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

    const body = await c.req.json()
    const parsed = FeedbackSubmission.safeParse(body)
    if (!parsed.success) {
      return c.json(
        { error: 'Invalid request', details: z.treeifyError(parsed.error) },
        400
      )
    }
    console.log('[/api/feedback] parsed submission:', parsed.data)

    // Insert raw feedback immediately for async processing
    const [rawFeedback] = await db
      .insert(RawFeedbacks)
      .values({
        projectId,
        email: parsed.data.email,
        feedback: parsed.data.feedback,
      })
      .returning()

    if (!rawFeedback) {
      return c.json({ error: 'Failed to store feedback' }, 500)
    }

    console.log('[/api/feedback] raw feedback stored:', rawFeedback.id)

    return c.json({ status: 'ok', rawFeedbackId: rawFeedback.id })
  })
}
