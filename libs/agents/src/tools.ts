import { tool } from 'ai'
import {
  projectAccess,
  featureAccess,
  feedbackAccess,
} from '@feedback-thing/core'
import {
  projectCreateSchema,
  projectSearchSchema,
  featureCreateSchema,
  featureSearchSchema,
  feedbackCreateSchema,
} from './schemas.ts'

export const searchProjectsTool = tool({
  description:
    'Search projects by name using ilike matching, you can run this multiple times to try out different variations',
  inputSchema: projectSearchSchema,
  execute: async ({ searchTerm }) => {
    return await projectAccess.search(searchTerm)
  },
})

export const createProjectTool = tool({
  description:
    'Create a new project if an appropriate one does not exist, do not ask the user to intervene unless they have not clearly provided a project/app/product name',
  inputSchema: projectCreateSchema,
  execute: async ({ name, createdBy }) => {
    return await projectAccess.create({ name, createdBy })
  },
})

export const searchFeaturesTool = tool({
  description:
    'Search features by name using ilike matching, you can run this multiple times to try out different variations',
  inputSchema: featureSearchSchema,
  execute: async ({ projectId, searchTerm }) => {
    return await featureAccess.search(projectId, searchTerm)
  },
})

export const createFeatureTool = tool({
  description:
    'Create a new feature if an appropriate one does not exist, do not ask the user to intervene unless they have not clearly provided details which you can interpret as a feature name and description',
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

export const createFeedbackTool = tool({
  description:
    'Create new feedback when the user has submitted some. use the search tools to find the relevant project and feature ID, you may create a new project/feature first if needed',
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

export const databaseTools = {
  searchProjects: searchProjectsTool,
  createProject: createProjectTool,
  searchFeatures: searchFeaturesTool,
  createFeature: createFeatureTool,
  createFeedback: createFeedbackTool,
}
