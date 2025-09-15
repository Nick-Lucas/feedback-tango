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
  inputSchema: projectCreateSchema,
  execute: async ({ name, createdBy }) => {
    return await projectAccess.create({ name, createdBy })
  },
})

export const getAllProjectsTool = tool({
  description: 'Get all projects',
  inputSchema: z.object({}),
  execute: async () => {
    return await projectAccess.getAll()
  },
})

export const getProjectByIdTool = tool({
  description: 'Get a project by its ID',
  inputSchema: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.getById(id)
  },
})

export const getProjectWithFeedbackTool = tool({
  description: 'Get a project with its feedback and features',
  inputSchema: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.getWithFeedback(id)
  },
})

export const updateProjectTool = tool({
  description: 'Update a project',
  inputSchema: projectUpdateSchema,
  execute: async ({ id, ...data }) => {
    const updateData: Partial<{ name: string }> = {}
    if (data.name !== undefined) updateData.name = data.name
    return await projectAccess.update(id, updateData)
  },
})

export const deleteProjectTool = tool({
  description: 'Delete a project',
  inputSchema: projectIdSchema,
  execute: async ({ id }) => {
    return await projectAccess.delete(id)
  },
})

export const getProjectsByCreatorTool = tool({
  description: 'Get projects by creator',
  inputSchema: projectCreatorSchema,
  execute: async ({ createdBy }) => {
    return await projectAccess.getByCreator(createdBy)
  },
})

// Feature tools
export const createFeatureTool = tool({
  description: 'Create a new feature',
  inputSchema: featureCreateSchema,
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
  inputSchema: z.object({}),
  execute: async () => {
    return await featureAccess.getAll()
  },
})

export const getFeatureByIdTool = tool({
  description: 'Get a feature by its ID',
  inputSchema: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.getById(id)
  },
})

export const getFeatureWithFeedbackTool = tool({
  description: 'Get a feature with its feedback',
  inputSchema: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.getWithFeedback(id)
  },
})

export const getFeaturesByProjectTool = tool({
  description: 'Get all features for a project',
  inputSchema: featureProjectSchema,
  execute: async ({ projectId }) => {
    return await featureAccess.getByProject(projectId)
  },
})

export const updateFeatureTool = tool({
  description: 'Update a feature',
  inputSchema: featureUpdateSchema,
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
  inputSchema: featureIdSchema,
  execute: async ({ id }) => {
    return await featureAccess.delete(id)
  },
})

export const getFeaturesByCreatorTool = tool({
  description: 'Get features by creator',
  inputSchema: featureCreatorSchema,
  execute: async ({ createdBy }) => {
    return await featureAccess.getByCreator(createdBy)
  },
})

// Feedback tools
export const createFeedbackTool = tool({
  description: 'Create new feedback',
  inputSchema: feedbackCreateSchema,
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
  inputSchema: z.object({}),
  execute: async () => {
    return await feedbackAccess.getAll()
  },
})

export const getFeedbackByIdTool = tool({
  description: 'Get feedback by its ID',
  inputSchema: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.getById(id)
  },
})

export const getFeedbackWithProjectTool = tool({
  description: 'Get feedback with project and feature info',
  inputSchema: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.getWithProject(id)
  },
})

export const getFeedbackByProjectTool = tool({
  description: 'Get all feedback for a project',
  inputSchema: feedbackProjectSchema,
  execute: async ({ projectId }) => {
    return await feedbackAccess.getByProject(projectId)
  },
})

export const getFeedbackByFeatureTool = tool({
  description: 'Get all feedback for a feature',
  inputSchema: feedbackFeatureSchema,
  execute: async ({ featureId }) => {
    return await feedbackAccess.getByFeature(featureId)
  },
})

export const updateFeedbackTool = tool({
  description: 'Update feedback',
  inputSchema: feedbackUpdateSchema,
  execute: async ({ id, ...data }) => {
    const updateData: Partial<{ feedback: string }> = {}
    if (data.feedback !== undefined) updateData.feedback = data.feedback
    return await feedbackAccess.update(id, updateData)
  },
})

export const deleteFeedbackTool = tool({
  description: 'Delete feedback',
  inputSchema: feedbackIdSchema,
  execute: async ({ id }) => {
    return await feedbackAccess.delete(id)
  },
})

export const getFeedbackByCreatorTool = tool({
  description: 'Get feedback by creator',
  inputSchema: feedbackCreatorSchema,
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
