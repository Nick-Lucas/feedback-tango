import { queryOptions, useMutation } from '@tanstack/react-query'
import { getProjects } from '@/server-functions/getProjects'
import { getFeatures } from '@/server-functions/getFeatures'
import { getFeature } from '@/server-functions/getFeature'
import { getProject } from '@/server-functions/getProject'
import { getProjectMembers } from '@/server-functions/getProjectMembers'
import { createProject } from '@/server-functions/createProject'
import { addProjectMember } from '@/server-functions/addProjectMember'
import { removeProjectMember } from '@/server-functions/removeProjectMember'
import { mergeFeatures } from '@/server-functions/mergeFeatures'
import { moveFeedbackToFeature } from '@/server-functions/moveFeedbackToFeature'
import { searchUsers } from '@/server-functions/searchUsers'

// Query Options Factories

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })

export const featuresQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId, 'features'],
    queryFn: () => getFeatures({ data: { projectId } }),
  })

export const featureQueryOptions = (featureId: string) =>
  queryOptions({
    queryKey: ['features', featureId],
    queryFn: () => getFeature({ data: { featureId } }),
  })

export const projectQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId],
    queryFn: () => getProject({ data: { projectId } }),
  })

export const projectMembersQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId, 'members'],
    queryFn: () => getProjectMembers({ data: { projectId } }),
  })

export const searchUsersQueryOptions = (query: string, projectId: string) =>
  queryOptions({
    queryKey: ['users', 'search', query, projectId],
    queryFn: () => searchUsers({ data: { query, projectId } }),
    enabled: query.length > 0,
  })

// Mutation Options Factories

export const useCreateProjectMutation = () =>
  useMutation({
    mutationFn: (data: { name: string }) =>
      createProject({
        data,
      }),
  })

export const useAddProjectMemberMutation = () =>
  useMutation({
    mutationFn: (data: {
      projectId: string
      userId: string
      role?: 'owner' | 'editor'
    }) =>
      addProjectMember({
        data: {
          projectId: data.projectId,
          userId: data.userId,
          role: data.role || 'editor',
        },
      }),
  })

export const useRemoveProjectMemberMutation = () =>
  useMutation({
    mutationFn: (data: { projectId: string; userId: string }) =>
      removeProjectMember({
        data,
      }),
  })

export const useMergeFeaturesMutation = () =>
  useMutation({
    mutationFn: (data: {
      featureIds: string[]
      newFeatureName: string
      newFeatureDescription: string
    }) =>
      mergeFeatures({
        data,
      }),
  })

export const useMoveFeedbackToFeatureMutation = () =>
  useMutation({
    mutationFn: (data: { feedbackId: string; featureId: string }) =>
      moveFeedbackToFeature({
        data,
      }),
  })
