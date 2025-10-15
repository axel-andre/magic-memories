import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  publishMemoryLaneFn, 
  unpublishMemoryLaneFn, 
  archiveMemoryLaneFn,
  updateMemoryLaneFn,
  getMemoryByIdQueryOptions 
} from "~/utils/server/memories";

interface UsePublicationStateProps {
  memoryLaneId: string;
  currentStatus: "draft" | "published" | "archived";
  onSuccess?: (newStatus: "draft" | "published" | "archived") => void;
  onError?: (error: string) => void;
}

export const usePublicationState = ({
  memoryLaneId,
  currentStatus,
  onSuccess,
  onError,
}: UsePublicationStateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries(getMemoryByIdQueryOptions(memoryLaneId));
  }, [queryClient, memoryLaneId]);

  const publishMutation = useMutation({
    mutationFn: publishMemoryLaneFn,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      invalidateQueries();
      onSuccess?.("published");
    },
    onError: (err: any) => {
      const errorMessage = err.message || "Failed to publish memory lane";
      setError(errorMessage);
      onError?.(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishMemoryLaneFn,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      invalidateQueries();
      onSuccess?.("draft");
    },
    onError: (err: any) => {
      const errorMessage = err.message || "Failed to unpublish memory lane";
      setError(errorMessage);
      onError?.(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveMemoryLaneFn,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      invalidateQueries();
      onSuccess?.("archived");
    },
    onError: (err: any) => {
      const errorMessage = err.message || "Failed to archive memory lane";
      setError(errorMessage);
      onError?.(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMemoryLaneFn,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      invalidateQueries();
    },
    onError: (err: any) => {
      const errorMessage = err.message || "Failed to update memory lane";
      setError(errorMessage);
      onError?.(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const changeStatus = useCallback((newStatus: "draft" | "published" | "archived") => {
    switch (newStatus) {
      case "published":
        if (currentStatus !== "published") {
          publishMutation.mutate({ data: { id: memoryLaneId } });
        }
        break;
      case "draft":
        if (currentStatus === "published") {
          unpublishMutation.mutate({ data: { id: memoryLaneId } });
        } else if (currentStatus === "archived") {
          updateMutation.mutate({ 
            data: { 
              id: memoryLaneId, 
              status: "draft" 
            } 
          });
        }
        break;
      case "archived":
        if (currentStatus !== "archived") {
          archiveMutation.mutate({ data: { id: memoryLaneId } });
        }
        break;
    }
  }, [
    currentStatus,
    memoryLaneId,
    publishMutation,
    unpublishMutation,
    archiveMutation,
    updateMutation,
  ]);

  const updateMemoryLane = useCallback((updates: { name?: string; status?: "draft" | "published" | "archived" }) => {
    updateMutation.mutate({
      data: {
        id: memoryLaneId,
        ...updates,
      },
    });
  }, [memoryLaneId, updateMutation]);

  return {
    isLoading: isLoading || publishMutation.isPending || unpublishMutation.isPending || archiveMutation.isPending || updateMutation.isPending,
    error,
    changeStatus,
    updateMemoryLane,
    // Individual mutation states for more granular control
    isPublishing: publishMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
    isArchiving: archiveMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
