import { useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createMemoryFn,
  getMemoryByIdQueryOptions,
  memoryFormValidator,
} from "~/utils/server/memories";
import { fileToBase64 } from "~/utils/file";

// Re-export validators for convenience
export {
  memoryTitleValidator as titleValidator,
  memoryContentValidator as contentValidator,
  memoryDateValidator as dateValidator,
  memoryImageValidator as imageValidator,
} from "~/utils/server/memories/schemas";

interface UseMemoryFormProps {
  memoryLaneId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useMemoryForm = ({
  memoryLaneId,
  onSuccess,
  onError,
}: UseMemoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    image: null as File | null,
  };

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: memoryFormValidator,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      try {
        if (!value.image) {
          throw new Error("Image is required");
        }

        const base64 = await fileToBase64(value.image);

        await createMemoryFn({
          data: {
            memoryLaneId,
            title: value.title,
            content: value.content,
            date: value.date,
            file: {
              data: base64,
              type: value.image.type,
              name: value.image.name,
              size: value.image.size,
            },
          },
        });

        await queryClient.invalidateQueries(
          getMemoryByIdQueryOptions(memoryLaneId)
        );

        // Reset form after successful submission
        resetFormValues();

        onSuccess?.();
        navigate({ to: "/memory-lanes/$id", params: { id: memoryLaneId } });
      } catch (err: any) {
        const errorMsg =
          err.message || "Failed to save memory. Please try again.";
        onError?.(errorMsg);
        // Re-throw to let TanStack Form handle the error
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const resetFormValues = useCallback(() => {
    // Reset form values
    form.setFieldValue("title", initialValues.title);
    form.setFieldValue("content", initialValues.content);
    form.setFieldValue("date", initialValues.date);
    form.setFieldValue("image", initialValues.image);

    // Reset image-related state
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setUploadedImages([]);
    setImagePreview(null);
  }, [form, imagePreview]);

  const handleImageDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        const file = files[0];
        setUploadedImages([file]);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        form.setFieldValue("image", file);
      }
    },
    [form]
  );

  const handleRemoveImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setUploadedImages([]);
    setImagePreview(null);
    form.setFieldValue("image", null);
  }, [imagePreview, form]);

  const resetForm = useCallback(() => {
    resetFormValues();
  }, [resetFormValues]);

  const handleCancel = useCallback(() => {
    // Clean up image preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    navigate({ to: "/memory-lanes/$id", params: { id: memoryLaneId } });
  }, [imagePreview, navigate, memoryLaneId]);

  return {
    form,
    isSubmitting,
    uploadedImages,
    imagePreview,
    handleImageDrop,
    handleRemoveImage,
    handleCancel,
    resetForm,
  };
};
