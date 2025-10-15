import React, { memo, useCallback } from 'react';
import { Button } from "./ui/button";
import { BaseDialog } from "./ui/BaseDialog";
import { FormField } from "./ui/FormField";
import { ImageUpload } from "./ui/ImageUpload";
import { useMemoryForm } from "~/hooks/useMemoryForm";

interface MemoryAdditionDialogProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const MemoryAdditionDialog = memo<MemoryAdditionDialogProps>(({
    id,
    isOpen,
    onClose,
    title = "Add New Memory",
    description = "Add a new memory with photos, descriptions, and dates."
}) => {
    const {
        form,
        isSubmitting,
        error,
        uploadedImages,
        imagePreview,
        handleImageDrop,
        handleRemoveImage,
        handleSubmit,
        handleCancel,
    } = useMemoryForm({
        memoryLaneId: id,
        onSuccess: onClose,
        onError: (error) => console.error('Memory creation error:', error),
    });
    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const values = form.state.values;
        await handleSubmit(values);
    }, [form.state.values, handleSubmit]);

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
                        onChange: ({ value }) => {
                            if (!value || value.trim().length === 0) {
                                return 'Title is required';
                            }
                            if (value.length < 3) {
                                return 'Title must be at least 3 characters';
                            }
                            if (value.length > 100) {
                                return 'Title must be less than 100 characters';
                            }
                            return undefined;
                        },
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
                        onChange: ({ value }) => {
                            if (!value) {
                                return 'Date is required';
                            }
                            return undefined;
                        },
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
                        onChange: ({ value }) => {
                            if (!value || value.trim().length === 0) {
                                return 'Description is required';
                            }
                            if (value.length < 10) {
                                return 'Description must be at least 10 characters';
                            }
                            if (value.length > 1000) {
                                return 'Description must be less than 1000 characters';
                            }
                            return undefined;
                        },
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
                        onChange: ({ value }) => {
                            if (!value) {
                                return 'Image is required';
                            }
                            return undefined;
                        },
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

                {error && (
                    <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive" role="alert">{error}</p>
                    </div>
                )}

                <div className="flex gap-2 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.state.canSubmit}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Memory'}
                    </Button>
                </div>
            </form>
        </BaseDialog>
    );
});

MemoryAdditionDialog.displayName = 'MemoryAdditionDialog';