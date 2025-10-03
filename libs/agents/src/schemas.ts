import { z } from 'zod'

// Project schemas
export const projectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const projectUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Project name is required').optional(),
})

export const projectIdSchema = z.object({
  id: z.string().min(1),
})

export const projectCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})

export const projectSearchSchema = z.object({
  searchTerm: z.string().min(1, 'Search term is required'),
})

// Feature schemas
export const featureCreateSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  description: z.string().min(1, 'Feature description is required'),
  projectId: z.string().min(1),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const featureUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Feature name is required').optional(),
  description: z.string().min(1, 'Feature description is required').optional(),
})

export const featureIdSchema = z.object({
  id: z.string().min(1),
})

export const featureProjectSchema = z.object({
  projectId: z.string().min(1),
})

export const featureCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})

export const featureSearchSchema = z.object({
  projectId: z.string().min(1),
  searchTerm: z.string().min(1, 'Search term is required'),
})

// Feedback schemas
export const feedbackCreateSchema = z.object({
  feedback: z.string().min(1, 'Feedback content is required'),
  projectId: z.string().min(1),
  featureId: z.string().min(1),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const feedbackUpdateSchema = z.object({
  id: z.string().min(1),
  feedback: z.string().min(1, 'Feedback content is required').optional(),
})

export const feedbackIdSchema = z.object({
  id: z.string().min(1),
})

export const feedbackProjectSchema = z.object({
  projectId: z.string().min(1),
})

export const feedbackFeatureSchema = z.object({
  featureId: z.string().min(1),
})

export const feedbackCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})
