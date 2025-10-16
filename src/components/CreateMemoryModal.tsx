import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createMemoryLaneFn } from "~/utils/server/memories";
import { ErrorAlert } from "./ui/ErrorAlert";
import { getUserErrorMessage } from "~/utils/errors";

interface CreateMemoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMemoryModal({
  open,
  onOpenChange,
}: CreateMemoryModalProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const newMemory = await createMemoryLaneFn({
          data: {
            name: value.name,
          },
        });

        onOpenChange(false);
        form.reset();

        navigate({
          to: "/memory-lanes/$id",
          params: { id: newMemory.id },
          search: { editing: true },
        });
      } catch (err: unknown) {
        setError(getUserErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a Memory Lane</DialogTitle>
          <DialogDescription>
            Give your memory lane a name to get started.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return "Memory name is required";
                }
                if (value.length < 3) {
                  return "Memory name must be at least 3 characters";
                }
                if (value.length > 100) {
                  return "Memory name must be less than 100 characters";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Memory Name *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Summer Vacation 2024"
                  disabled={isSubmitting}
                />
                {field.state.meta.errors &&
                field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {error && <ErrorAlert message={error} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.state.canSubmit}
            >
              {isSubmitting ? "Creating..." : "Create Memory Lane"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

