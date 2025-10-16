import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getAllMemoriesInfiniteQueryOptions } from "~/utils/server/memories";
import { Polaroid } from "./Polaroid";
import { Skeleton } from "./ui/skeleton";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";

export const MemoryLanesFeed = () => {
  const limit = 9;
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getAllMemoriesInfiniteQueryOptions(limit));

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // Flatten all pages into a single array
  const memories = data?.pages.flat() ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2 pt-12">
        <div className="flex flex-wrap gap-4 gap-y-20 w-full justify-between">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="max-w-60 max-h-80">
              <Skeleton className="h-60 w-60 bg-white" />
              <div className="mt-2">
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
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
            <p className="text-lg text-destructive">
              Error loading memories: {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2 pt-12">
      <div className="flex flex-wrap gap-4 gap-y-20 w-full justify-between">
        {memories.map((memory, index) => (
          <Link
            to="/memory-lanes/$id"
            params={{ id: memory.id }}
            key={memory.id}
          >
            <Polaroid.Root
              hasSelection={false}
              isStacked
              isSelected={false}
              key={memory.id}
              src={
                memory.memories?.[0]?.image || "https://placehold.co/240x320"
              }
              alt={memory.name}
              caption={memory.name}
              aspectRatio="square"
              className="max-w-60 max-h-80"
              rotate={index % 2 === 0 ? 10 : -10}
              footer={
                <>
                  <Polaroid.Caption>{memory.name}</Polaroid.Caption>
                  <Polaroid.SubCaption>
                    By{" "}
                    <Link
                      to="/users/$id"
                      params={{ id: memory.user.id }}
                      className="text-primary hover:text-primary/80"
                    >
                      {memory.user.name}
                    </Link>
                  </Polaroid.SubCaption>
                </>
              }
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-4 pt-8">
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <p className="text-muted-foreground">Loading more memories...</p>
          )}
          {!hasNextPage && memories.length > 0 && (
            <p className="text-muted-foreground">No more memories ...</p>
          )}
        </div>
      </div>
    </div>
  );
};
