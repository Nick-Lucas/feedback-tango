import { tool } from 'ai'
import { z } from 'zod'
import {
  projectAccess,
  featureAccess,
  feedbackAccess,
} from '@feedback-thing/core'
import {
  projectCreateSchema,
  projectUpdateSchema,
  projectIdSchema,
  projectCreatorSchema,
  featureCreateSchema,
  featureUpdateSchema,
  featureIdSchema,
  featureProjectSchema,
  featureCreatorSchema,
  feedbackCreateSchema,
  feedbackUpdateSchema,
  feedbackIdSchema,
  feedbackProjectSchema,
  feedbackFeatureSchema,
  feedbackCreatorSchema,
} from './schemas.ts'

// Project tools
export const createProjectTool = tool({
  description: 'Create a new project',
  parameters: projectCreateSchema,
  execute: async ({ name, createdBy }) => {
    return await projectAccess.create({ name, createdBy })
  },
})

export const getAllProjectsTool = tool({
  description: 'Get all projects',
  parameters: z.object({}),
  execute: async () => {
    return await projectAccess.getAll()
  },
})

export const getProjectByIdTool = tool({
  description: 'Get a project by its ID',
  parameters: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.getById(id)
  },
})

export const getProjectWithFeedbackTool = tool({
  description: 'Get a project with its feedback and features',
  parameters: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.getWithFeedback(id)
  },
})

export const updateProjectTool = tool({
  description: 'Update a project',
  parameters: projectUpdateSchema,
  execute: async ({ id, ...data }) => {
    const updateData: Partial<{ name: string }> = {}
    if (data.name !== undefined) updateData.name = data.name
    return await projectAccess.update(id, updateData)
  },
})

export const deleteProjectTool = tool({
  description: 'Delete a project',
  parameters: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.delete(id)
  },
})

export const getProjectsByCreatorTool = tool({
  description: 'Get projects by creator',
  parameters: projectCreatorSchema,
  execute: async ({ createdBy }) => {
    return await projectAccess.getByCreator(createdBy)
  },
})

// Feature tools
export const createFeatureTool = tool({
  description: 'Create a new feature',
  parameters: featureCreateSchema,
  execute: async ({ name, description, projectId, createdBy }) => {
    return await featureAccess.create({
      name,
      description,
      projectId,
      createdBy,
    })
  },
})

export const getAllFeaturesTool = tool({
  description: 'Get all features',
  parameters: z.object({}),
  execute: async () => {
    return await featureAccess.getAll()
  },
})

export const getFeatureByIdTool = tool({
  description: 'Get a feature by its ID',
  parameters: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.getById(id)
  },
})

export const getFeatureWithFeedbackTool = tool({
  description: 'Get a feature with its feedback',
  parameters: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.getWithFeedback(id)
  },
})

export const getFeaturesByProjectTool = tool({
  description: 'Get all features for a project',
  parameters: featureProjectSchema,
  execute: async ({ projectId }) => {
    return await featureAccess.getByProject(projectId)
  },
})

export const updateFeatureTool = tool({
  description: 'Update a feature',
  parameters: featureUpdateSchema,
  execute: async ({ id, ...data }) => {
    const updateData: Partial<{ name: string; description: string }> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined)
      updateData.description = data.description
    return await featureAccess.update(id, updateData)
  },
})

export const deleteFeatureTool = tool({
  description: 'Delete a feature',
  parameters: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.delete(id)
  },
})

export const getFeaturesByCreatorTool = tool({
  description: 'Get features by creator',
  parameters: featureCreatorSchema,
  execute: async ({ createdBy }) => {
    return await featureAccess.getByCreator(createdBy)
  },
})

// Feedback tools
export const createFeedbackTool = tool({
  description: 'Create new feedback',
  parameters: feedbackCreateSchema,
  execute: async ({ feedback, projectId, featureId, createdBy }) => {
    return await feedbackAccess.create({
      feedback,
      projectId,
      featureId,
      createdBy,
    })
  },
})

export const getAllFeedbackTool = tool({
  description: 'Get all feedback',
  parameters: z.object({}),
  execute: async () => {
    return await feedbackAccess.getAll()
  },
})

export const getFeedbackByIdTool = tool({
  description: 'Get feedback by its ID',
  parameters: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.getById(id)
  },
})

export const getFeedbackWithProjectTool = tool({
  description: 'Get feedback with project and feature info',
  parameters: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.getWithProject(id)
  },
})

export const getFeedbackByProjectTool = tool({
  description: 'Get all feedback for a project',
  parameters: feedbackProjectSchema,
  execute: async ({ projectId }) => {
    return await feedbackAccess.getByProject(projectId)
  },
})

export const getFeedbackByFeatureTool = tool({
  description: 'Get all feedback for a feature',
  parameters: feedbackFeatureSchema,
  execute: async ({ featureId }) => {
    return await feedbackAccess.getByFeature(featureId)
  },
})

export const updateFeedbackTool = tool({
  description: 'Update feedback',
  parameters: feedbackUpdateSchema,
  execute: async ({ id, ...data }) => {
    const updateData: Partial<{ feedback: string }> = {}
    if (data.feedback !== undefined) updateData.feedback = data.feedback
    return await feedbackAccess.update(id, updateData)
  },
})

export const deleteFeedbackTool = tool({
  description: 'Delete feedback',
  parameters: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.delete(id)
  },
})

export const getFeedbackByCreatorTool = tool({
  description: 'Get feedback by creator',
  parameters: feedbackCreatorSchema,
  execute: async ({ createdBy }) => {
    return await feedbackAccess.getByCreator(createdBy)
  },
})

// Export all tools as a collection
export const databaseTools = {
  // Project tools
  createProject: createProjectTool,
  getAllProjects: getAllProjectsTool,
  getProjectById: getProjectByIdTool,
  getProjectWithFeedback: getProjectWithFeedbackTool,
  updateProject: updateProjectTool,
  deleteProject: deleteProjectTool,
  getProjectsByCreator: getProjectsByCreatorTool,

  // Feature tools
  createFeature: createFeatureTool,
  getAllFeatures: getAllFeaturesTool,
  getFeatureById: getFeatureByIdTool,
  getFeatureWithFeedback: getFeatureWithFeedbackTool,
  getFeaturesByProject: getFeaturesByProjectTool,
  updateFeature: updateFeatureTool,
  deleteFeature: deleteFeatureTool,
  getFeaturesByCreator: getFeaturesByCreatorTool,

  // Feedback tools
  createFeedback: createFeedbackTool,
  getAllFeedback: getAllFeedbackTool,
  getFeedbackById: getFeedbackByIdTool,
  getFeedbackWithProject: getFeedbackWithProjectTool,
  getFeedbackByProject: getFeedbackByProjectTool,
  getFeedbackByFeature: getFeedbackByFeatureTool,
  updateFeedback: updateFeedbackTool,
  deleteFeedback: deleteFeedbackTool,
  getFeedbackByCreator: getFeedbackByCreatorTool,
}
