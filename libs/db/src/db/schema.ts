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
    index('features_name_embedding_idx_cosine').using(
      'hnsw',
      table.nameEmbedding.op('vector_cosine_ops')
    ),
  ]
)

export const FeatureRelations = relations(Features, ({ one, many }) => ({
  project: one(Projects, {
    fields: [Features.projectId],
    references: [Projects.id],
  }),
  feedbacks: many(Feedbacks),
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
