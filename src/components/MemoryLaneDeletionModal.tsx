import React, { memo, useState } from "react";
import { Button } from "./ui/button";
import { BaseDialog } from "./ui/BaseDialog";
import { deleteMemoryLaneFn } from "~/utils/server/memories";
import { useNavigate } from "@tanstack/react-router";

interface MemoryLaneDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryLaneId: string;
  memoryLaneName: string;
  onSuccess?: () => void;
}

export const MemoryLaneDeletionModal = memo<MemoryLaneDeletionModalProps>(
  ({ isOpen, onClose, memoryLaneId, memoryLaneName, onSuccess }) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteMemoryLaneFn({
          data: { memoryLaneId },
        });

        // Close modal and call success callback
        onClose();
        onSuccess?.();

        // Navigate to home page after successful deletion
        navigate({ to: "/" });
      } catch (err: any) {
        setError(
          err.message || "Failed to delete memory lane. Please try again."
        );
      } finally {
        setIsDeleting(false);
      }
    };

    const handleCancel = () => {
      setError(null);
      onClose();
    };

    return (
      <BaseDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Memory Lane"
        description="This action cannot be undone."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              Are you sure you want to delete the memory lane{" "}
              <strong>"{memoryLaneName}"</strong>?
            </p>
            <p className="text-sm text-orange-700 mt-2">
              This will permanently delete the memory lane and all its memories.
            </p>
          </div>

          {error && (
            <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete Memory Lane"}
            </Button>
          </div>
        </div>
      </BaseDialog>
    );
  }
);

MemoryLaneDeletionModal.displayName = "MemoryLaneDeletionModal";
