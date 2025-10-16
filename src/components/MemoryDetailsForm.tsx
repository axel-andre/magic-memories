import { useId } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { updateMemoryFn } from "~/utils/server/memories/update";
import { getMemoryByIdQueryOptions } from "~/utils/server/memories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type MemoryDetailsFormValues = {
    title: string;
    content?: string;
    date?: string; // ISO string (yyyy-mm-dd)
};

export type MemoryDetailsFormProps = {
  memoryLaneId: string;
  id: string;
  values: MemoryDetailsFormValues;
  onDelete: () => void;
  isSubmitting?: boolean;
};

export function MemoryDetailsForm({
  memoryLaneId,
  id,
  values,
  onDelete,
  isSubmitting,
}: MemoryDetailsFormProps) {
  const queryClient = useQueryClient();
  const titleId = useId();
  const dateId = useId();
  const contentId = useId();
  const updateMemoryMutation = useMutation({
    mutationFn: updateMemoryFn,
    onSuccess: () => {
      queryClient.invalidateQueries(getMemoryByIdQueryOptions(memoryLaneId));
    },
  });
  const form = useForm({
    defaultValues: {
      title: values.title,
      date: new Date(values.date ?? new Date()).toISOString().split("T")[0],
      content: values.content,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!id) {
        throw new Error("Id is required");
      }
      await updateMemoryMutation.mutateAsync({
        data: {
          id,
          title: value.title,
          date: value.date,
          content: value.content,
        },
      });
    },
  });
  return (
    <form onSubmit={form.handleSubmit} className="w-full sticky top-28">
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Memory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={titleId}>Title</Label>
              <form.Field
                name="title"
                children={(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="A special moment"
                    required
                  />
                )}
              ></form.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={dateId}>Date</Label>
              <form.Field
                name="date"
                children={(field) => (
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              ></form.Field>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={contentId}>Content</Label>
              <form.Field
                name="content"
                children={(field) => (
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              ></form.Field>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete()}
                className="mr-2"
                disabled={isSubmitting}
              >
                Delete
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit}
                disabled={isSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
