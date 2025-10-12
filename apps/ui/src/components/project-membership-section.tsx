import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  searchUsersQueryOptions,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} from '@/lib/query-options'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Member {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  role: 'owner' | 'editor'
}

interface ProjectMembershipSectionProps {
  projectId: string
  members: Member[]
  projectCreatorId: string
  isOwner: boolean
}

export function ProjectMembershipSection({
  projectId,
  members,
  projectCreatorId,
  isOwner,
}: ProjectMembershipSectionProps) {
  const queryClient = useQueryClient()
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    ...searchUsersQueryOptions(searchQuery, projectId),
    enabled: searchQuery.trim().length > 0,
  })

  const addMemberMutation = useAddProjectMemberMutation()
  const removeMemberMutation = useRemoveProjectMemberMutation()

  const handleAddMember = async (userId: string) => {
    try {
      await addMemberMutation.mutateAsync({
        projectId,
        userId,
      })
      toast.success('Member added successfully')
      setAddMemberOpen(false)
      setSearchQuery('')
      // Invalidate project members query
      await queryClient.invalidateQueries({
        queryKey: ['projects', projectId, 'members'],
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add member'
      )
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberMutation.mutateAsync({
        projectId,
        userId,
      })
      toast.success('Member removed successfully')
      // Invalidate project members query
      await queryClient.invalidateQueries({
        queryKey: ['projects', projectId, 'members'],
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove member'
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Users in this list can access and manage this project
            </CardDescription>
          </div>
          {isOwner && (
            <Popover open={addMemberOpen} onOpenChange={setAddMemberOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="end">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {isSearching && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Searching...
                      </div>
                    )}
                    {!isSearching &&
                      searchQuery &&
                      searchResults.length === 0 && (
                        <CommandEmpty>No users found.</CommandEmpty>
                      )}
                    {searchResults.length > 0 && (
                      <CommandGroup>
                        {searchResults.map((user) => {
                          const isAlreadyMember = members.some(
                            (m) => m.user.id === user.id
                          )
                          return (
                            <CommandItem
                              key={user.id}
                              disabled={
                                isAlreadyMember || addMemberMutation.isPending
                              }
                              onSelect={() => handleAddMember(user.id)}
                              className="flex items-center gap-3"
                            >
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                              {isAlreadyMember && (
                                <span className="text-xs text-muted-foreground">
                                  Already a member
                                </span>
                              )}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.user.id}
              className="flex items-center gap-3 p-2 rounded-lg border"
            >
              {member.user.image ? (
                <img
                  src={member.user.image}
                  alt={member.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{member.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted capitalize">
                  {member.role}
                </span>
                {isOwner && member.user.id !== projectCreatorId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.user.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
