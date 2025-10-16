import React, { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { PublicationStatusBadge } from "./ui/PublicationStatusBadge";
import { 
  getPublishedMemoryLanesQueryOptions 
} from "~/utils/server/memories";
import { Polaroid } from "./Polaroid";
import { authClient } from "~/utils/auth";

interface PublishedMemoryLanesFeedProps {
  page?: number;
  limit?: number;
  className?: string;
}

export const PublishedMemoryLanesFeed = memo<PublishedMemoryLanesFeedProps>(
  ({ page = 1, limit = 12, className = "" }) => {
    const {
      data: memoryLanes,
      isLoading,
      error,
    } = useQuery(getPublishedMemoryLanesQueryOptions(page, limit));
    const { data: sessionData } = authClient.useSession();
    const memoryLanesWithMemories = useMemo(() => {
      return (
        memoryLanes?.filter(
          (lane) => lane.memories && lane.memories.length > 0
        ) || []
      );
    }, [memoryLanes]);

    if (isLoading) {
      return (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
        >
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full rounded-lg mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="text-destructive mb-2">
            Failed to load magical memories
          </div>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      );
    }

    if (!memoryLanesWithMemories.length) {
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className="text-muted-foreground mb-2">
            No published magical memories found
          </div>
          <p className="text-sm text-muted-foreground">
            Check back later for new magical memories to explore!
          </p>
        </div>
      );
    }

    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {memoryLanesWithMemories.map((memoryLane) => {
          const firstMemory = memoryLane.memories?.[0];
          const memoryCount = memoryLane.memories?.length || 0;

          return (
            <Link
              key={memoryLane.id}
              to="/memory-lanes/$id"
              params={{ id: memoryLane.id }}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {memoryLane.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {memoryLane.user?.name || "Unknown"}</span>
                    <PublicationStatusBadge
                      status={memoryLane.status}
                      isOwner={sessionData?.user?.id === memoryLane.user?.id}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {firstMemory && (
                    <div className="mb-3">
                      <Polaroid.Root
                        src={firstMemory.image}
                        alt={firstMemory.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {memoryCount} {memoryCount === 1 ? "memory" : "memories"}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(memoryLane.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }
);

PublishedMemoryLanesFeed.displayName = "PublishedMemoryLanesFeed";
