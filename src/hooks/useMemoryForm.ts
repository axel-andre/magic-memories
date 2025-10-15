import { useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createMemoryFn,
  getMemoryByIdQueryOptions,
} from "~/utils/server/memories";
import { fileToBase64 } from "~/utils/file";

interface UseMemoryFormProps {
  memoryLaneId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface MemoryFormValues {
  title: string;
  content: string;
  date: string;
  image: File | null;
}

export const useMemoryForm = ({
  memoryLaneId,
  onSuccess,
  onError,
}: UseMemoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      image: null as File | null,
    },
  });

  const handleImageDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        const file = files[0];
        setUploadedImages([file]);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        form.setFieldValue("image", file);
        setError(null); // Clear any previous errors
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

  const handleSubmit = useCallback(
    async (values: MemoryFormValues) => {
      if (!values.image) {
        const errorMsg = "Image is required";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const base64 = await fileToBase64(values.image);

        await createMemoryFn({
          data: {
            memoryLaneId,
            title: values.title,
            content: values.content,
            date: values.date,
            file: {
              data: base64,
              type: values.image.type,
              name: values.image.name,
              size: values.image.size,
            },
          },
        });

        await queryClient.invalidateQueries(
          getMemoryByIdQueryOptions(memoryLaneId)
        );

        // Clean up image preview
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }

        onSuccess?.();
        navigate({ to: "/memory-lanes/$id", params: { id: memoryLaneId } });
      } catch (err: any) {
        console.error("Error saving memory:", err);
        const errorMsg =
          err.message || "Failed to save memory. Please try again.";
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [memoryLaneId, imagePreview, queryClient, navigate, onSuccess, onError]
  );

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
    error,
    uploadedImages,
    imagePreview,
    handleImageDrop,
    handleRemoveImage,
    handleSubmit,
    handleCancel,
  };
};
