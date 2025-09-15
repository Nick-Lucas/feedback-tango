export { FeedbackAgent } from './agent.js'
export { databaseTools } from './tools.js'
export * from './schemas.js'

// Export individual tools for granular usage
export {
  // Project tools
  createProjectTool,
  getAllProjectsTool,
  getProjectByIdTool,
  getProjectWithFeedbackTool,
  updateProjectTool,
  deleteProjectTool,
  getProjectsByCreatorTool,

  // Feature tools
  createFeatureTool,
  getAllFeaturesTool,
  getFeatureByIdTool,
  getFeatureWithFeedbackTool,
  getFeaturesByProjectTool,
  updateFeatureTool,
  deleteFeatureTool,
  getFeaturesByCreatorTool,

  // Feedback tools
  createFeedbackTool,
  getAllFeedbackTool,
  getFeedbackByIdTool,
  getFeedbackWithProjectTool,
  getFeedbackByProjectTool,
  getFeedbackByFeatureTool,
  updateFeedbackTool,
  deleteFeedbackTool,
  getFeedbackByCreatorTool,
} from './tools.js'
