import React, { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { PublicationControls } from "./PublicationControls";
import { MemoryLaneEditDialog } from "./MemoryLaneEditDialog";

interface MemoryLaneHeaderProps {
  memoryLane: {
    id: string;
    name: string;
    status: "draft" | "published" | "archived";
    user?: {
      id: string;
      name: string;
    } | null;
  };
  isEditing: boolean;
  isOwner: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (title: string) => void;
  onAddMemory: () => void;
  onDelete: () => void;
  onStatusChange: (status: "draft" | "published" | "archived") => void;
  isStatusChanging?: boolean;
}

export const MemoryLaneHeader = memo<MemoryLaneHeaderProps>(
  ({
    memoryLane,
    isEditing,
    isOwner,
    onEdit,
    onCancel,
    onSave,
    onAddMemory,
    onDelete,
    onStatusChange,
    isStatusChanging = false,
  }) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const form = useForm({
      defaultValues: {
        title: memoryLane.name,
      },
      onSubmit: async ({ value }) => {
        onSave(value.title);
      },
    });

    const handleEditDetails = () => {
      setShowEditDialog(true);
    };

    const handleEditDialogClose = () => {
      setShowEditDialog(false);
    };

    const handleEditDialogSave = (name: string) => {
      onSave(name);
      setShowEditDialog(false);
    };

    return (
      <div className="space-y-4">
        <div
          className={`flex gap-8 items-start max-w-4xl mx-auto ${isEditing ? "bg-muted/30 rounded-lg p-6 -m-6" : ""}`}
        >
          <div className="flex-1">
            {!isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {memoryLane.name}
                  </h1>
                  <PublicationControls
                    memoryLaneId={memoryLane.id}
                    currentStatus={memoryLane.status}
                    isOwner={isOwner}
                    onStatusChange={onStatusChange}
                    onEdit={handleEditDetails}
                    isLoading={isStatusChanging}
                  />
                </div>
                {memoryLane.user?.id && (
                  <Link
                    to="/users/$id"
                    params={{ id: memoryLane.user.id }}
                    className="text-muted-foreground"
                  >
                    By{" "}
                    <Button variant="link" className="p-0">
                      {memoryLane.user.name}
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <form.Field
                    name="title"
                    children={(field) => (
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="text-3xl font-bold h-12 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                        placeholder="Enter memory lane title..."
                      />
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    By {memoryLane.user?.name}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link
                      to="/memory-lanes/$id"
                      params={{ id: memoryLane.id }}
                      search={{ editing: false }}
                    >
                      Cancel
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <Button onClick={onAddMemory} variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Memory
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  to="/memory-lanes/$id"
                  params={{ id: memoryLane.id }}
                  search={{ editing: true }}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          )}
        </div>

        <MemoryLaneEditDialog
          isOpen={showEditDialog}
          onClose={handleEditDialogClose}
          currentName={memoryLane.name}
          currentStatus={memoryLane.status}
          onSave={handleEditDialogSave}
          isLoading={isStatusChanging}
        />
      </div>
    );
  }
);

MemoryLaneHeader.displayName = "MemoryLaneHeader";
