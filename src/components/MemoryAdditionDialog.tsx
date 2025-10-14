import { Label } from "@radix-ui/react-label"
import { Trash2Icon } from "lucide-react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '~/components/ui/shadcn-io/dropzone'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useForm } from "@tanstack/react-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
// import { createMemoryFn, getMemoryByIdQueryOptions } from "~/utils/server/memories"
import { DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"
import { fileToBase64 } from "~/utils/file"
import { createMemoryFn, getMemoryByIdQueryOptions } from "~/utils/server/memories"

interface MemoryAdditionDialogProps {
    id: string
}

export function MemoryAdditionDialog({ id }: MemoryAdditionDialogProps) {
    const navigate = useNavigate()
    const [isSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const handleImageDrop = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0]
            setUploadedImages([file])

            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)

            form.setFieldValue('image', file)
        }
    }

    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview)
        }
        setUploadedImages([])
        setImagePreview(null)
        form.setFieldValue('image', null)
    }
    const form = useForm({
        defaultValues: {
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0],
            image: null as File | null,
        },
    })
    const queryClient = useQueryClient()
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
                try {
                    if (!form.state.values.image) {
                        throw new Error('Image is required')
                    }

                    const base64 = await fileToBase64(form.state.values.image)

                    await createMemoryFn({
                        data: {
                            memoryLaneId: id,
                            title: form.state.values.title,
                            content: form.state.values.content,
                            date: form.state.values.date,
                            file: {
                                data: base64,
                                type: form.state.values.image.type,
                                name: form.state.values.image.name,
                                size: form.state.values.image.size,
                            },
                        },
                    })
                    await queryClient.invalidateQueries(getMemoryByIdQueryOptions(id))

                } catch (err: any) {
                    console.error('Error saving memory:', err)
                    setError(err.message || 'Failed to save memory. Please try again.')
                } finally {
                }
                navigate({ to: '/memory-lanes/$id', params: { id } })
            }}
            className="flex flex-col gap-4"
        >
            <form.Field
                name="title"
                validators={{
                    onChange: ({ value }) => {
                        if (!value || value.trim().length === 0) {
                            return 'Title is required'
                        }
                        if (value.length < 3) {
                            return 'Title must be at least 3 characters'
                        }
                        if (value.length > 100) {
                            return 'Title must be less than 100 characters'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Title *</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g., Beach Day at Sunset"
                            disabled={isSubmitting}
                        />
                        {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        ) : null}
                    </div>
                )}
            </form.Field>

            {/* Date Field */}
            <form.Field
                name="date"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) {
                            return 'Date is required'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Date *</Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        ) : null}
                    </div>
                )}
            </form.Field>

            {/* Content Field */}
            <form.Field
                name="content"
                validators={{
                    onChange: ({ value }) => {
                        if (!value || value.trim().length === 0) {
                            return 'Description is required'
                        }
                        if (value.length < 10) {
                            return 'Description must be at least 10 characters'
                        }
                        if (value.length > 1000) {
                            return 'Description must be less than 1000 characters'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Description *</Label>
                        <Textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Describe this memory..."
                            rows={5}
                            disabled={isSubmitting}
                        />
                        {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        ) : null}
                    </div>
                )}
            </form.Field>

            {/* Image Upload Field */}
            <form.Field
                name="image"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) {
                            return 'Image is required'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Image *</Label>

                        {!imagePreview ? (
                            <Dropzone
                                accept={{
                                    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                                }}
                                maxFiles={1}
                                maxSize={5 * 1024 * 1024} // 5MB
                                onDrop={handleImageDrop}
                                className="max-h-20"
                                onError={(error) => {
                                    setError(error.message)
                                }}
                                disabled={isSubmitting}
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
                                        onClick={handleRemoveImage}
                                        disabled={isSubmitting}
                                    >
                                        <Trash2Icon className="w-4 h-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {uploadedImages[0]?.name} ({(uploadedImages[0]?.size / 1024).toFixed(2)} KB)
                                </p>
                            </div>
                        )}

                        {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
                            <p className="text-sm text-destructive">
                                {field.state.meta.errors[0]}
                            </p>
                        ) : null}
                    </div>
                )}
            </form.Field>

            {/* Error Message */}
            {error && (
                <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/memory-lanes/$id', params: { id } })}
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={isSubmitting || !form.state.canSubmit}
            >
                {isSubmitting ? 'Saving...' : 'Save Memory'}
            </Button>
        </form >

    )
}

const Header = ({ title, description }: { title: string, description?: string }) => {
    return (
        <DialogHeader>
            <DialogTitle>Add memory to {title}</DialogTitle>
            {description && (
                <span className="text-sm text-muted-foreground">
                    {description}
                </span>
            )}
        </DialogHeader>
    )
}
MemoryAdditionDialog.Header = Header