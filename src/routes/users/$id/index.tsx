import { createFileRoute } from '@tanstack/react-router'
import { UserProfileFeed } from '~/components/UserProfileFeed';
import { getUserMemoriesInfiniteQueryOptions, getUserMemoriesQueryOptions } from '~/utils/server/memories';
import { getUserByIdPublicQueryOptions } from '~/utils/server/users';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export const Route = createFileRoute('/users/$id/')({
  component: UserProfile,
  loader: async ({ context, params }) => {
    const { id } = params;
    await Promise.all([
      context.queryClient.ensureInfiniteQueryData(getUserMemoriesInfiniteQueryOptions(id, 9)),
      context.queryClient.ensureQueryData(getUserByIdPublicQueryOptions(id)),
    ]);
  },
})

function UserProfile() {
  const { id } = Route.useParams();
  const { data: user, isLoading: userLoading, error: userError } = useQuery(getUserByIdPublicQueryOptions(id));

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12">
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.email}</p>
          </div>
        </div>
        <UserProfileFeed userId={id} />
      </div>
    </div>
  );
}
