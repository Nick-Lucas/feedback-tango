import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  halfvec,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
export * from './auth-schema.ts'
import { user } from './auth-schema.ts'

// TODO: indexes!
// TODO: updatedAt/By fields!

export const Projects = pgTable('projects', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  name: text().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  createdBy: text().notNull(),
})

export const ProjectRelations = relations(Projects, ({ many }) => ({
  features: many(Features),
  feedbacks: many(Feedbacks),
  members: many(ProjectMembers),
}))
export const UserRelations = relations(user, ({ many }) => ({
  projectMemberships: many(ProjectMembers),
}))

export const ProjectMemberRole = pgEnum('project_member_role', [
  'editor',
  'owner',
])
export const ProjectMembers = pgTable('project_members', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  projectId: uuid()
    .notNull()
    .references(() => Projects.id),
  userId: text()
    .notNull()
    .references(() => user.id),
  role: ProjectMemberRole().notNull().default('editor'),
  createdAt: timestamp().defaultNow().notNull(),
})
export const ProjectMemberRelations = relations(ProjectMembers, ({ one }) => ({
  project: one(Projects, {
    fields: [ProjectMembers.projectId],
    references: [Projects.id],
  }),
  user: one(user, {
    fields: [ProjectMembers.userId],
    references: [user.id],
  }),
}))

export const Features = pgTable(
  'features',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    projectId: uuid()
      .notNull()
      .references(() => Projects.id),
    name: text().notNull().unique(),
    nameEmbedding: halfvec({ dimensions: 3072 }),
    description: text().notNull(),
    createdBy: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index().using('hnsw', table.nameEmbedding.op('halfvec_cosine_ops')),
  ]
)

export const FeatureRelations = relations(Features, ({ one, many }) => ({
  project: one(Projects, {
    fields: [Features.projectId],
    references: [Projects.id],
  }),
  feedbacks: many(Feedbacks),
}))

export const RawFeedbacks = pgTable(
  'raw_feedback',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    projectId: uuid()
      .notNull()
      .references(() => Projects.id),
    email: text(),
    feedback: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),

    // Processing status fields
    safetyCheckComplete: timestamp(),
    featureAssociationComplete: timestamp(),
    processingError: text(),

    // Link to final feedback entry once processed
    processedFeedbackId: uuid().references(() => Feedbacks.id),
  },
  (table) => [
    index().on(table.safetyCheckComplete),
    index().on(table.featureAssociationComplete),
    index().on(table.processingError),
    index().on(table.projectId),
  ]
)

export const RawFeedbackRelations = relations(RawFeedbacks, ({ one }) => ({
  project: one(Projects, {
    fields: [RawFeedbacks.projectId],
    references: [Projects.id],
  }),
  processedFeedback: one(Feedbacks, {
    fields: [RawFeedbacks.processedFeedbackId],
    references: [Feedbacks.id],
  }),
}))

export const Feedbacks = pgTable('feedback', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  projectId: uuid()
    .notNull()
    .references(() => Projects.id),
  featureId: uuid()
    .notNull()
    .references(() => Features.id),
  feedback: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  createdBy: text().notNull(),
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
  createdByUser: one(user, {
    fields: [Feedbacks.createdBy],
    references: [user.id],
  }),
}))
