import React, { memo } from 'react';
import { Label } from '@radix-ui/react-label';
import { Trash2Icon } from 'lucide-react';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '~/components/ui/shadcn-io/dropzone';
import { Button } from './button';

interface ImageUploadProps {
    label: string;
    required?: boolean;
    imagePreview: string | null;
    uploadedImages: File[];
    onImageDrop: (files: File[]) => void;
    onRemoveImage: () => void;
    disabled?: boolean;
    error?: string;
    maxSize?: number;
    acceptedTypes?: string[];
}

export const ImageUpload = memo<ImageUploadProps>(({
    label,
    required = false,
    imagePreview,
    uploadedImages,
    onImageDrop,
    onRemoveImage,
    disabled = false,
    error,
    maxSize = 5 * 1024 * 1024, // 5MB
    acceptedTypes = ['image/*'],
}) => {
    const acceptedFileTypes = acceptedTypes.reduce((acc, type) => {
        acc[type] = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>

            {!imagePreview ? (
                <Dropzone
                    accept={acceptedFileTypes}
                    maxFiles={1}
                    maxSize={maxSize}
                    onDrop={onImageDrop}
                    className="max-h-20"
                    disabled={disabled}
                    src={uploadedImages}
                >
                    <DropzoneContent />
                    <DropzoneEmptyState />
                </Dropzone>
            ) : (
                <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border border-border">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto object-cover max-h-40"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={onRemoveImage}
                            disabled={disabled}
                            aria-label="Remove image"
                        >
                            <Trash2Icon className="w-4 h-4 mr-1" />
                            Remove
                        </Button>
                    </div>
                    {uploadedImages[0] && (
                        <p className="text-sm text-muted-foreground">
                            {uploadedImages[0].name} ({(uploadedImages[0].size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

ImageUpload.displayName = 'ImageUpload';
