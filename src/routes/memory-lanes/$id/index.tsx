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
import { deleteMemoryFn } from "~/utils/server/memories/delete";
import { usePublicationState } from "~/hooks/usePublicationState";

export const Route = createFileRoute("/memory-lanes/$id/")({
  component: RouteComponent,
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

function RouteComponent() {
  const { id } = Route.useParams();
  const { editing } = Route.useSearch();
  const navigate = useNavigate();
  const { data: sessionData, isPending } = authClient.useSession();
  const { data } = useQuery(getMemoryByIdQueryOptions(id));
  const queryClient = useQueryClient();
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
    onSuccess: (newStatus) => {
      console.log(`Memory lane status changed to: ${newStatus}`);
    },
    onError: (error) => {
      console.error("Status change error:", error);
    },
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

  // Event handlers
  const handleEdit = useCallback(() => {
    // Navigate to edit mode
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
    // TODO: Implement memory lane deletion
    console.log("Deleting memory lane:", id);
  }, [id]);

  const handleMemoryChange = useCallback((values: MemoryDetailsFormValues) => {
    // TODO: Handle memory changes
    console.log("Memory changed:", values);
  }, []);

  const handleMemorySubmit = useCallback(() => {
    // TODO: Handle memory submission
    console.log("Memory submitted");
  }, []);
  if (!data) {
    return <div>Loading...</div>;
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
              onMemoryChange={handleMemoryChange}
              onMemorySubmit={handleMemorySubmit}
              onMemoryDelete={() => {
                deleteMemory({
                  data: { memoryId: currentMemory.id, memoryLaneId: id },
                });
              }}
            />
          )}
        </div>
      )}

      <MemoryAdditionDialog
        id={id}
        isOpen={showAddMemoryDialog}
        onClose={closeAddMemoryDialog}
        title={`Add memory to ${data.name || "Memory Lane"}`}
        description="Add a new memory with photos, descriptions, and dates."
      />
    </div>
  );
}
