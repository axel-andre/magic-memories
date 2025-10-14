import { createFileRoute, Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Polaroid } from '~/components/Polaroid';
import { getAllMemoriesInfiniteQueryOptions } from '~/utils/server/memories';
import { useEffect, useRef } from 'react';
import { MemoryLanesFeed } from '~/components/MemoryLanesFeed';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(getAllMemoriesInfiniteQueryOptions(1));
  },
})

function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore their memories</h1>
        <MemoryLanesFeed />
      </div>
    </div>
  );
}
