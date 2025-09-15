import { z } from 'zod'

// Project schemas
export const projectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const projectUpdateSchema = z.object({
  id: z.number().int().positive('Project ID must be a positive integer'),
  name: z.string().min(1, 'Project name is required').optional(),
})

export const projectIdSchema = z.object({
  id: z.number().int().positive('Project ID must be a positive integer'),
})

export const projectCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})

// Feature schemas
export const featureCreateSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  description: z.string().min(1, 'Feature description is required'),
  projectId: z.number().int().positive('Project ID must be a positive integer'),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const featureUpdateSchema = z.object({
  id: z.number().int().positive('Feature ID must be a positive integer'),
  name: z.string().min(1, 'Feature name is required').optional(),
  description: z.string().min(1, 'Feature description is required').optional(),
})

export const featureIdSchema = z.object({
  id: z.number().int().positive('Feature ID must be a positive integer'),
})

export const featureProjectSchema = z.object({
  projectId: z.number().int().positive('Project ID must be a positive integer'),
})

export const featureCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})

// Feedback schemas
export const feedbackCreateSchema = z.object({
  feedback: z.string().min(1, 'Feedback content is required'),
  projectId: z.number().int().positive('Project ID must be a positive integer'),
  featureId: z.number().int().positive('Feature ID must be a positive integer'),
  createdBy: z.string().min(1, 'Creator is required'),
})

export const feedbackUpdateSchema = z.object({
  id: z.number().int().positive('Feedback ID must be a positive integer'),
  feedback: z.string().min(1, 'Feedback content is required').optional(),
})

export const feedbackIdSchema = z.object({
  id: z.number().int().positive('Feedback ID must be a positive integer'),
})

export const feedbackProjectSchema = z.object({
  projectId: z.number().int().positive('Project ID must be a positive integer'),
})

export const feedbackFeatureSchema = z.object({
  featureId: z.number().int().positive('Feature ID must be a positive integer'),
})

export const feedbackCreatorSchema = z.object({
  createdBy: z.string().min(1, 'Creator is required'),
})
