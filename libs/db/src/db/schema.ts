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

export const SentimentEnum = pgEnum('sentiment_enum', [
  'positive',
  'constructive',
  'negative',
])
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
    content: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),

    // Processing status fields
    safetyCheckComplete: timestamp(),
    splittingComplete: timestamp(),
    processingComplete: timestamp(),
    processingError: text(),
  },
  (table) => [
    index().on(table.safetyCheckComplete),
    index().on(table.splittingComplete),
    index().on(table.processingComplete),
    index().on(table.processingError),
    index().on(table.projectId),
  ]
)

export const RawFeedbackRelations = relations(
  RawFeedbacks,
  ({ one, many }) => ({
    project: one(Projects, {
      fields: [RawFeedbacks.projectId],
      references: [Projects.id],
    }),
    items: many(RawFeedbackItems),
  })
)

export const RawFeedbackItems = pgTable(
  'raw_feedback_items',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    rawFeedbackId: uuid()
      .notNull()
      .references(() => RawFeedbacks.id),
    content: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),

    // Processing status fields
    sentimentCheckResult: SentimentEnum(),
    sentimentCheckComplete: timestamp(),
    featureAssociationComplete: timestamp(),
    processingError: text(),
  },
  (table) => [
    index().on(table.rawFeedbackId),
    index().on(table.sentimentCheckResult),
    index().on(table.sentimentCheckComplete),
    index().on(table.featureAssociationComplete),
    index().on(table.processingError),
  ]
)

export const RawFeedbackItemRelations = relations(
  RawFeedbackItems,
  ({ one }) => ({
    rawFeedback: one(RawFeedbacks, {
      fields: [RawFeedbackItems.rawFeedbackId],
      references: [RawFeedbacks.id],
    }),
    feedback: one(Feedbacks),
  })
)

export const Feedbacks = pgTable(
  'feedback',
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    projectId: uuid()
      .notNull()
      .references(() => Projects.id),
    featureId: uuid()
      .notNull()
      .references(() => Features.id),
    rawFeedbackItemId: uuid().references(() => RawFeedbackItems.id),
    content: text().notNull(),
    sentiment: SentimentEnum(),
    email: text(),
    createdAt: timestamp().defaultNow().notNull(),
    createdBy: text().notNull(),
  },
  (self) => {
    return [
      index().on(self.projectId),
      index().on(self.featureId),
      index().on(self.sentiment),
      index().on(self.rawFeedbackItemId),
    ]
  }
)

export const FeedbackRelations = relations(Feedbacks, ({ one }) => ({
  project: one(Projects, {
    fields: [Feedbacks.projectId],
    references: [Projects.id],
  }),
  feature: one(Features, {
    fields: [Feedbacks.featureId],
    references: [Features.id],
  }),
  rawFeedbackItem: one(RawFeedbackItems, {
    fields: [Feedbacks.rawFeedbackItemId],
    references: [RawFeedbackItems.id],
  }),
  createdByUser: one(user, {
    fields: [Feedbacks.createdBy],
    references: [user.id],
  }),
}))
