import React, { memo, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { BaseDialog } from "./ui/BaseDialog";
import { FormField } from "./ui/FormField";
import { ImageUpload } from "./ui/ImageUpload";
import {
  useMemoryForm,
  titleValidator,
  contentValidator,
  dateValidator,
  imageValidator,
} from "~/hooks/useMemoryForm";
interface MemoryAdditionDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const MemoryAdditionDialog = memo<MemoryAdditionDialogProps>(
  ({
    id,
    isOpen,
    onClose,
    title = "Add New Memory",
    description = "Add a new memory with photos, descriptions, and dates.",
  }) => {
    const {
      form,
      isSubmitting,
      uploadedImages,
      imagePreview,
      handleImageDrop,
      handleRemoveImage,
      resetForm,
    } = useMemoryForm({
      memoryLaneId: id,
      onSuccess: onClose,
    });

    // Reset form when dialog is closed
    useEffect(() => {
      if (!isOpen) {
        resetForm();
      }
    }, [isOpen, resetForm]);

    const handleFormSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      },
      [form]
    );

    return (
      <BaseDialog
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <form.Field
            name="title"
            validators={{
              onChange: titleValidator,
            }}
          >
            {(field) => (
              <FormField
                label="Title"
                name="title"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                placeholder="e.g., Beach Day at Sunset"
                required
                disabled={isSubmitting}
                maxLength={100}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="date"
            validators={{
              onChange: dateValidator,
            }}
          >
            {(field) => (
              <FormField
                label="Date"
                name="date"
                type="date"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                required
                disabled={isSubmitting}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="content"
            validators={{
              onChange: contentValidator,
            }}
          >
            {(field) => (
              <FormField
                label="Description"
                name="content"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                placeholder="Describe this memory..."
                required
                disabled={isSubmitting}
                multiline
                rows={5}
                maxLength={1000}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          <form.Field
            name="image"
            validators={{
              onChange: imageValidator,
            }}
          >
            {(field) => (
              <ImageUpload
                label="Image"
                required
                imagePreview={imagePreview}
                uploadedImages={uploadedImages}
                onImageDrop={handleImageDrop}
                onRemoveImage={handleRemoveImage}
                disabled={isSubmitting}
                error={field.state.meta.errors?.[0]}
              />
            )}
          </form.Field>

          {form.state.submissionAttempts > 0 &&
            form.state.errorMap?.onSubmit && (
              <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive" role="alert">
                  {form.state.errorMap.onSubmit}
                </p>
              </div>
            )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !form.state.canSubmit}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Memory"}
            </Button>
          </div>
        </form>
      </BaseDialog>
    );
  }
);

MemoryAdditionDialog.displayName = "MemoryAdditionDialog";
