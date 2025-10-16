import { createFileRoute } from "@tanstack/react-router";
import { getAllMemoriesInfiniteQueryOptions } from "~/utils/server/memories";
import { MemoryLanesFeed } from "~/components/MemoryLanesFeed";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: Home,
  pendingComponent: HomePending,
  loader: async ({ context }) => {
    await context.queryClient.ensureInfiniteQueryData(
      getAllMemoriesInfiniteQueryOptions(1)
    );
  },
});

function HomePending() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12">
      <div className="space-y-2">
        <Skeleton className="h-9 w-80" />
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
      </div>
    </div>
  );
}

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
