import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  getUserMemoriesInfiniteQueryOptions,
  deleteMemoryLaneFn,
} from "~/utils/server/memories";
import { Polaroid } from "./Polaroid";
import { PublicationStatusBadge } from "./ui/PublicationStatusBadge";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { authClient } from "~/utils/auth";
import { Trash2 } from "lucide-react";
import { MemoryLaneDeletionModal } from "./MemoryLaneDeletionModal";

interface UserProfileFeedProps {
  userId: string;
}

export const UserProfileFeed = ({ userId }: UserProfileFeedProps) => {
  const [limit, setLimit] = useState(9);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemoryLane, setSelectedMemoryLane] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { data: sessionData } = authClient.useSession();
  const queryClient = useQueryClient();
  const isOwner = sessionData?.user?.id === userId;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getUserMemoriesInfiniteQueryOptions(userId, limit));

  const { mutate: deleteMemoryLane, isPending: isDeleting } = useMutation({
    mutationFn: deleteMemoryLaneFn,
    onSuccess: () => {
      queryClient.invalidateQueries(
        getUserMemoriesInfiniteQueryOptions(userId, limit)
      );
    },
  });

  const handleDeleteMemoryLane = (
    memoryLaneId: string,
    memoryLaneName: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedMemoryLane({ id: memoryLaneId, name: memoryLaneName });
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setSelectedMemoryLane(null);
  };

  const observerRef = useRef<HTMLDivElement>(null);
  // Flatten all pages into a single array
  const memories = data?.pages.flat() ?? [];
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
          <div className="flex items-center justify-center pt-12">
            <p className="text-lg text-destructive">
              Error loading memories: {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="space-y-2">
          <div className="flex items-center justify-center pt-12">
            <p className="text-lg text-muted-foreground">
              No memories found for this user.
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
          <div key={memory.id} className="relative group">
            <Link to="/memory-lanes/$id" params={{ id: memory.id }}>
              <Polaroid.Root
                hasSelection={false}
                isStacked
                isSelected={false}
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
                      By {memory.user.name}
                    </Polaroid.SubCaption>
                    {isOwner && (
                      <div className="mt-2 flex flex-col items-center gap-2">
                        <PublicationStatusBadge status={memory.status} />
                      </div>
                    )}
                    {isOwner && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                        onClick={(e) =>
                          handleDeleteMemoryLane(memory.id, memory.name, e)
                        }
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                }
              />
            </Link>
          </div>
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

      {selectedMemoryLane && (
        <MemoryLaneDeletionModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedMemoryLane(null);
          }}
          memoryLaneId={selectedMemoryLane.id}
          memoryLaneName={selectedMemoryLane.name}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
