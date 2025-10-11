import { Feedbacks } from '@feedback-thing/db'
import type { NewFeedback } from './access.ts'
import { db } from './access.ts'

// Feedback CRUD operations

export const feedbackAccess = {
  // Create new feedback
  create: async (data: Omit<NewFeedback, 'id' | 'createdAt'>) => {
    const [feedbackItem] = await db.insert(Feedbacks).values(data).returning()
    if (!feedbackItem) {
      throw new Error('Failed to create feedback')
    }
    return {
      id: feedbackItem.id,
      feedback: feedbackItem.feedback,
    }
  },
}
