import React, { memo, useCallback, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";
import { BaseDialog } from "./ui/BaseDialog";
import { FormField } from "./ui/FormField";

interface MemoryLaneEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentStatus: "draft" | "published" | "archived";
  onSave: (name: string) => void;
  isLoading?: boolean;
}

export const MemoryLaneEditDialog = memo<MemoryLaneEditDialogProps>(({
  isOpen,
  onClose,
  currentName,
  currentStatus,
  onSave,
  isLoading = false,
}) => {
  const form = useForm({
    defaultValues: {
      name: currentName,
    },
  });

  // Update form when dialog opens or current name changes
  useEffect(() => {
    if (isOpen) {
      form.setFieldValue("name", currentName);
    }
  }, [isOpen, currentName, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const values = form.state.values;
      if (values.name.trim()) {
        onSave(values.name.trim());
      }
    },
    [form.state.values, onSave]
  );

  const handleCancel = useCallback(() => {
    form.setFieldValue("name", currentName); // Reset to original value
    onClose();
  }, [currentName, onClose, form]);

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Memory Lane"
      description="Update the name and details of your memory lane."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.trim().length === 0) {
                return "Name is required";
              }
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }
              if (value.length > 100) {
                return "Name must be less than 100 characters";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <FormField
              label="Memory Lane Name"
              name="name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              onBlur={field.handleBlur}
              placeholder="Enter memory lane name..."
              required
              disabled={isLoading}
              maxLength={100}
              error={field.state.meta.errors?.[0]}
            />
          )}
        </form.Field>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Current Status:</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            currentStatus === "published" 
              ? "bg-green-100 text-green-800" 
              : currentStatus === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-600"
          }`}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.state.canSubmit}
            className="flex-1"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseDialog>
  );
});

MemoryLaneEditDialog.displayName = "MemoryLaneEditDialog";
