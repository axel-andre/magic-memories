import React, { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { authClient } from "~/utils/auth";
import { getMemoryByIdQueryOptions } from "~/utils/server/memories";
import z from "zod";
import { MemoryDetailsEmptyState } from "~/components/MemoryDetailsEmptyState";
import { MemoryAdditionDialog } from "~/components/MemoryAdditionDialog";
import { MemoryLaneHeader } from "~/components/MemoryLaneHeader";
import { MemoryGallery } from "~/components/MemoryGallery";
import { MemoryDetailsPanel } from "~/components/MemoryDetailsPanel";
import { useMemoryLaneState } from "~/hooks/useMemoryLaneState";
import { MemoryDetailsFormValues } from "~/components/MemoryDetailsForm";
import {
  deleteMemoryFn,
  deleteMemoryLaneFn,
} from "~/utils/server/memories/delete";
import { usePublicationState } from "~/hooks/usePublicationState";
import { MemoryLaneDeletionModal } from "~/components/MemoryLaneDeletionModal";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/memory-lanes/$id/")({
  component: RouteComponent,
  pendingComponent: MemoryLanePending,
  beforeLoad: async ({ context, params, search }) => {
    const { id } = params;
    const { editing } = search;
    const data = await context.queryClient.ensureQueryData(
      getMemoryByIdQueryOptions(id)
    );
    if (editing && data?.user?.id !== context.user?.id) {
      throw redirect({
        to: "/memory-lanes/$id",
        params: { id },
        search: { editing: false },
      });
    }
  },
  loader: async ({ context, params, location }) => {
    const { id } = params;
    const memoryLane = await context.queryClient.ensureQueryData(
      getMemoryByIdQueryOptions(id)
    );
    return { memoryLane };
  },
  ssr: true,
  errorComponent: (error) => <div>Error: {JSON.stringify(error)}</div>,
  validateSearch: z.object({
    editing: z.boolean().optional().default(false),
  }),
});

function MemoryLanePending() {
  return (
    <div className="max-w-4xl mt-8 mx-auto">
      {/* Header skeleton */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-white" />
            <Skeleton className="h-4 w-48 bg-white" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 bg-white" />
            <Skeleton className="h-9 w-24 bg-white" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 bg-white" />
          <Skeleton className="h-8 w-20 bg-white" />
          <Skeleton className="h-8 w-24 bg-white" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex gap-20 justify-center w-full">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-32 bg-white" />
            ))}
          </div>
        </div>

        {/* Details panel skeleton */}
        <div className="w-80 space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-full bg-white" />
            <Skeleton className="h-4 w-3/4 bg-white" />
            <Skeleton className="h-4 w-1/2 bg-white" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full bg-white" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 bg-white" />
              <Skeleton className="h-8 w-20 bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { id } = Route.useParams();
  const { editing } = Route.useSearch();
  const navigate = useNavigate();
  const { data: sessionData, isPending } = authClient.useSession();
  const { data } = useQuery(getMemoryByIdQueryOptions(id));
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { mutate: deleteMemory } = useMutation({
    mutationFn: deleteMemoryFn,
    onSuccess: () => {
      queryClient.invalidateQueries(getMemoryByIdQueryOptions(id));
    },
  });

  const {
    revealedMemories,
    selectedMemory,
    showAddMemoryDialog,
    handleMemoryVisible,
    handleMemoryClick,
    openAddMemoryDialog,
    closeAddMemoryDialog,
  } = useMemoryLaneState();

  const {
    isLoading: isStatusChanging,
    changeStatus,
    updateMemoryLane,
  } = usePublicationState({
    memoryLaneId: id,
    currentStatus: data?.status || "draft",
  });

  // Memoized computed values
  const hasMemories = useMemo(
    () => (data?.memories?.length ?? 0) > 0,
    [data?.memories?.length]
  );
  const isOwner = useMemo(
    () => sessionData?.user?.id === data?.user?.id,
    [sessionData?.user?.id, data?.user?.id]
  );
  const currentMemory = useMemo(
    () => data?.memories?.[selectedMemory],
    [data?.memories, selectedMemory]
  );

  const handleEdit = useCallback(() => {
    navigate({
      to: "/memory-lanes/$id",
      params: { id },
      search: { editing: true },
    });
  }, [id, navigate]);

  const handleCancel = useCallback(() => {
    // Navigate back to view mode
    navigate({
      to: "/memory-lanes/$id",
      params: { id },
      search: { editing: false },
    });
  }, [id, navigate]);

  const handleSave = useCallback(
    (title: string) => {
      updateMemoryLane({ name: title });
      handleCancel();
    },
    [updateMemoryLane, handleCancel]
  );

  const handleStatusChange = useCallback(
    (status: "draft" | "published" | "archived") => {
      changeStatus(status);
    },
    [changeStatus]
  );

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setShowDeleteModal(false);
    navigate({ to: "/" });
  }, [navigate]);

  if (!data) {
    return <MemoryLanePending />;
  }

  return (
    <div className="max-w-4xl mt-8 mx-auto">
      <MemoryLaneHeader
        memoryLane={data}
        isEditing={editing}
        isOwner={isOwner}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onAddMemory={openAddMemoryDialog}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        isStatusChanging={isStatusChanging}
      />

      {!hasMemories ? (
        <MemoryDetailsEmptyState id={id} onAddMemory={openAddMemoryDialog} />
      ) : (
        <div className="flex gap-20 justify-center w-full">
          <MemoryGallery
            memories={data.memories || []}
            revealedMemories={revealedMemories}
            isOwner={isOwner}
            onMemoryVisible={handleMemoryVisible}
            onMemoryClick={handleMemoryClick}
            onAddMemory={openAddMemoryDialog}
          />

          {!isPending && hasMemories && currentMemory && (
            <MemoryDetailsPanel
              memory={currentMemory}
              memoryLaneId={id}
              isEditing={editing}
              isPending={isPending}
              onMemoryDelete={() => {
                deleteMemory({
                  data: { memoryId: currentMemory.id },
                });
              }}
            />
          )}
        </div>
      )}

      {isOwner && (
        <MemoryAdditionDialog
          id={id}
          isOpen={showAddMemoryDialog}
          onClose={closeAddMemoryDialog}
          title={`Add memory to ${data.name || "Memory Lane"}`}
          description="Add a new memory with photos, descriptions, and dates."
        />
      )}

      {isOwner && (
        <MemoryLaneDeletionModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          memoryLaneId={id}
          memoryLaneName={data.name || "Memory Lane"}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
