import { createFileRoute, Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Polaroid } from '~/components/Polaroid';
import { getAllMemoriesInfiniteQueryOptions } from '~/utils/server/memories';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(getAllMemoriesInfiniteQueryOptions(1));
  },
})

function Home() {
  const limit = 9;
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getAllMemoriesInfiniteQueryOptions(limit));

  // Flatten all pages into a single array
  const memories = data?.pages.flat() ?? [];

  // Set up Intersection Observer to trigger loading when scrolling to the end
  useEffect(() => {
    const currentObserverRef = observerRef.current;

    if (!currentObserverRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentObserverRef);

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-sans">Welcome Home!</h1>
          <div className="flex items-center justify-center pt-12">
            <p className="text-lg text-muted-foreground">Loading memories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome Home!</h1>
          <div className="flex items-center justify-center pt-12">
            <p className="text-lg text-destructive">Error loading memories: {error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore their memories</h1>
        <div className="space-y-2 pt-12">
          <div className="flex flex-wrap gap-4 gap-y-20 w-full justify-between">
            {memories.map((memory, index) => (
              <Link to="/memory-lanes/$id" params={{ id: memory.id }} key={memory.id}>
                <Polaroid
                  key={memory.id}
                  src='https://placehold.co/200x400'
                  alt={memory.name}
                  caption={memory.name}
                  aspectRatio="landscape"
                  className="max-w-sm max-h-xs"
                  rotate={index % 2 === 0 ? 10 : -10}
                />
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-8">
            <div ref={observerRef} className="h-10 flex items-center justify-center">
              {isFetchingNextPage && (
                <p className="text-muted-foreground">Loading more memories...</p>
              )}
              {!hasNextPage && memories.length > 0 && (
                <p className="text-muted-foreground">No more memories ...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
