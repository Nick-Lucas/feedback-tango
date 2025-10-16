import type {
  Projects,
  Features,
  Feedbacks,
  RawFeedbacks,
} from '@feedback-thing/db'
import { createDb } from '@feedback-thing/db'

export type Project = typeof Projects.$inferSelect
export type NewProject = typeof Projects.$inferInsert
export type Feature = typeof Features.$inferSelect
export type NewFeature = typeof Features.$inferInsert
export type Feedback = typeof Feedbacks.$inferSelect
export type NewFeedback = typeof Feedbacks.$inferInsert
export type RawFeedback = typeof RawFeedbacks.$inferSelect
export type NewRawFeedback = Pick<
  typeof RawFeedbacks.$inferInsert,
  'projectId' | 'email' | 'content'
>

export const db = createDb()
