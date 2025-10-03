import { pgTable, text, serial, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
export * from './auth-schema.ts'

export const Projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: text('created_by').notNull(),
})

export const ProjectRelations = relations(Projects, ({ many }) => ({
  features: many(Features),
  feedbacks: many(Feedbacks),
}))

export const Features = pgTable('features', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => Projects.id),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const FeatureRelations = relations(Features, ({ one, many }) => ({
  project: one(Projects, {
    fields: [Features.projectId],
    references: [Projects.id],
  }),
  feedbacks: many(Feedbacks),
}))

export const Feedbacks = pgTable('feedback', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => Projects.id),
  featureId: integer('feature_id')
    .notNull()
    .references(() => Features.id),
  feedback: text('feedback').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: text('created_by').notNull(),
})

export const FeedbackRelations = relations(Feedbacks, ({ one }) => ({
  project: one(Projects, {
    fields: [Feedbacks.projectId],
    references: [Projects.id],
  }),
  feature: one(Features, {
    fields: [Feedbacks.featureId],
    references: [Features.id],
  }),
}))
