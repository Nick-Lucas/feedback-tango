import { RawFeedbacks } from '@feedback-thing/db'
import type { NewRawFeedback } from './access.ts'
import { db } from './access.ts'

// Raw Feedback CRUD operations

export const rawFeedbackAccess = {
  // Create new raw feedback
  create: async (data: NewRawFeedback) => {
    const [rawFeedbackItem] = await db
      .insert(RawFeedbacks)
      .values(data)
      .returning()
    if (!rawFeedbackItem) {
      throw new Error('Failed to create raw feedback')
    }
    return {
      id: rawFeedbackItem.id,
      feedback: rawFeedbackItem.feedback,
      projectId: rawFeedbackItem.projectId,
      email: rawFeedbackItem.email,
    }
  },
}
