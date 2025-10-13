import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  useQuery,
} from '@tanstack/react-query'

import { useServerFn } from '@tanstack/react-start'
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
import { getRawFeedbacks } from '@/server-functions/getRawFeedbacks'
import { getRawFeedbackCounts } from '@/server-functions/getRawFeedbackCounts'

// Query Options Factories

function createQueryFactory<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFunction extends (opts: { data: any }) => Promise<any>,
>(opts: { baseKey: string[]; defaultFunction: TFunction }) {
  return (
    options: {
      fn?: (opts: Parameters<TFunction>[0]) => ReturnType<TFunction>
    } & Parameters<TFunction>[0]
  ) => {
    const fn = options?.fn ?? opts.defaultFunction

    return queryOptions<Awaited<ReturnType<TFunction>>, Error>({
      queryKey: [...opts.baseKey, options.data],
      queryFn: () => fn(options),
    })
  }
}

export const projectsQueryOptions = createQueryFactory({
  baseKey: ['projects'],
  defaultFunction: getProjects,
})

export const projectQueryOptions = createQueryFactory({
  baseKey: ['project'],
  defaultFunction: getProject,
})

export const projectMembersQueryOptions = createQueryFactory({
  baseKey: ['projects', 'members'],
  defaultFunction: getProjectMembers,
})

export const featuresQueryOptions = createQueryFactory({
  baseKey: ['features'],
  defaultFunction: getFeatures,
})

export const featureQueryOptions = createQueryFactory({
  baseKey: ['feature'],
  defaultFunction: getFeature,
})

export const searchUsersQueryOptions = createQueryFactory({
  baseKey: ['users', 'search'],
  defaultFunction: searchUsers,
})

export const rawFeedbacksQueryOptions = createQueryFactory({
  baseKey: ['raw-feedbacks'],
  defaultFunction: getRawFeedbacks,
})

export const rawFeedbackCountsQueryOptions = createQueryFactory({
  baseKey: ['raw-feedback', 'counts'],
  defaultFunction: getRawFeedbackCounts,
})

// Query Hooks

export const useProjectsQuery = () => {
  const fn = useServerFn(getProjects)

  return useSuspenseQuery(
    projectsQueryOptions({
      fn,
    })
  )
}

export const useFeaturesQuery = (projectId: string) => {
  const fn = useServerFn(getFeatures)

  return useSuspenseQuery(
    featuresQueryOptions({
      fn: fn,
      data: { projectId },
    })
  )
}

export const useFeatureQuery = (featureId: string) => {
  const fn = useServerFn(getFeature)

  return useSuspenseQuery(
    featureQueryOptions({
      fn,
      data: { featureId },
    })
  )
}

export const useProjectQuery = (projectId: string) => {
  const fn = useServerFn(getProject)

  return useSuspenseQuery(
    projectQueryOptions({
      fn,
      data: { projectId },
    })
  )
}

export const useProjectMembersQuery = (projectId: string) => {
  const fn = useServerFn(getProjectMembers)

  return useSuspenseQuery(
    projectMembersQueryOptions({
      fn,
      data: { projectId },
    })
  )
}

export const useSearchUsersQuery = (query: string, projectId: string) => {
  const fn = useServerFn(searchUsers)
  return useQuery({
    ...searchUsersQueryOptions({
      fn,
      data: { query, projectId },
    }),
    enabled: query.length > 0,
  })
}

export const useRawFeedbacksQuery = (
  projectId: string,
  filter?: 'all' | 'pending' | 'completed' | 'errors'
) => {
  const fn = useServerFn(getRawFeedbacks)

  return useSuspenseQuery(
    rawFeedbacksQueryOptions({
      fn,
      data: { projectId, filter },
    })
  )
}

export const useRawFeedbackCountsQuery = (projectId: string) => {
  const fn = useServerFn(getRawFeedbackCounts)

  return useSuspenseQuery({
    ...rawFeedbackCountsQueryOptions({
      fn,
      data: { projectId },
    }),
    refetchInterval: 5000,
  })
}

// Mutation Hooks

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient()
  const requestCreateProject = useServerFn(createProject)

  return useMutation({
    mutationFn: (data: { name: string }) =>
      requestCreateProject({
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export const useAddProjectMemberMutation = () => {
  const queryClient = useQueryClient()
  const requestAddProjectMember = useServerFn(addProjectMember)

  return useMutation({
    mutationFn: (data: {
      projectId: string
      userId: string
      role?: 'owner' | 'editor'
    }) =>
      requestAddProjectMember({
        data: {
          projectId: data.projectId,
          userId: data.userId,
          role: data.role || 'editor',
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export const useRemoveProjectMemberMutation = () => {
  const queryClient = useQueryClient()
  const requestRemoveProjectMember = useServerFn(removeProjectMember)

  return useMutation({
    mutationFn: (data: { projectId: string; userId: string }) =>
      requestRemoveProjectMember({
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

export const useMergeFeaturesMutation = (opts: { onMerged(): void }) => {
  const queryClient = useQueryClient()
  const requestMergeFeatures = useServerFn(mergeFeatures)

  return useMutation({
    mutationFn: (data: {
      featureIds: string[]
      newFeatureName: string
      newFeatureDescription: string
    }) =>
      requestMergeFeatures({
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()

      opts.onMerged()
    },
  })
}

export const useMoveFeedbackToFeatureMutation = () => {
  const queryClient = useQueryClient()
  const requestMoveFeedbackToFeature = useServerFn(moveFeedbackToFeature)

  return useMutation({
    mutationFn: (data: { feedbackId: string; featureId: string }) =>
      requestMoveFeedbackToFeature({
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}
