import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { getMemoryByIdQueryOptions } from '~/utils/server/memories';

export const Route = createFileRoute('/memory-lanes/$id')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { id } = params;
    await context.queryClient.ensureQueryData(getMemoryByIdQueryOptions(id));
  },
})

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useQuery(getMemoryByIdQueryOptions(id));
  return <div>Hello "/memory-lanes/$id"!

    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
}
