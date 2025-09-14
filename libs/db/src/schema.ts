import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: text('created_at')
    .default(sql`(datetime('now'))`)
    .notNull(),
  createdBy: text('created_by').notNull(),
})

export const projectRelations = relations(projects, ({ many }) => ({
  feedbacks: many(feedback),
}))

export const feedback = sqliteTable('feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  feedback: text('feedback').notNull(),
  createdAt: text('created_at')
    .default(sql`(datetime('now'))`)
    .notNull(),
  createdBy: text('created_by').notNull(),
})

export const feedbackRelations = relations(feedback, ({ one }) => ({
  project: one(projects, {
    fields: [feedback.projectId],
    references: [projects.id],
  }),
}))
