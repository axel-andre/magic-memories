import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Eye, ImagePlus, Pencil, Plus, Trash } from "lucide-react";
import { Polaroid } from "~/components/Polaroid";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { MemoryDetails } from "~/components/MemoryDetails";
import { authClient } from "~/utils/auth";
import { getMemoryByIdQueryOptions } from "~/utils/server/memories";
import { useState } from "react";
import { MemoryDetailsForm } from "~/components/MemoryDetailsForm";
import z from "zod";
import { MemoryDetailsEmptyState } from "~/components/MemoryDetailsEmptyState";
import { useForm } from "@tanstack/react-form";
import { Input } from "~/components/ui/input";
import { MemoryAdditionDialog } from "~/components/MemoryAdditionDialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export const Route = createFileRoute("/memory-lanes/$id/")({
  component: RouteComponent,
  beforeLoad: async ({ context, params, search }) => {
    const { id } = params;
    const { editing } = search;
    const data = await context.queryClient.ensureQueryData(getMemoryByIdQueryOptions(id));
    if (editing && data?.user?.id !== context.user?.id) {
      throw redirect({ to: "/memory-lanes/$id", params: { id }, search: { editing: false } })
    }
  },
  loader: async ({ context, params, location }) => {
    const { id } = params;
    const memoryLane = await context.queryClient.ensureQueryData(getMemoryByIdQueryOptions(id));
    return { memoryLane };
  },
  ssr: true,
  errorComponent: (error) => <div>Error: {JSON.stringify(error)}</div>,
  validateSearch: z.object({
    editing: z.boolean().optional().default(false),
  })
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { editing } = Route.useSearch();
  const [revealedMemories, setRevealedMemories] = useState<number[]>(
    [0]
  );
  const [selectedMemory, setSelectedMemory] = useState<number>(0);
  const [showAddMemoryDialog, setShowAddMemoryDialog] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();
  const { data } = useQuery(getMemoryByIdQueryOptions(id));
  const hasMemories = (data?.memories?.length ?? 0) > 0;
  const form = useForm({
    defaultValues: {
      title: data?.name ?? "",
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement memory lane title update
      console.log("Updating memory lane title:", value.title);
      // For now, just redirect back to non-editing mode
      // In a real implementation, you'd call an update function here
    },
  });
  return (
    <div className="max-w-4xl mt-8 mx-auto">
      <div className={`flex gap-8 items-start max-w-4xl mx-auto ${editing ? 'bg-muted/30 rounded-lg p-6 -m-6' : ''}`}>
        <div className="flex-1">
          {!editing ? (
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{data?.name}</h1>
              <p className="text-muted-foreground">By {data?.user?.name}</p>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <form.Field name="title" children={(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="text-3xl font-bold h-12 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    placeholder="Enter memory lane title..."
                  />
                )} />
                <p className="text-sm text-muted-foreground">By {data?.user?.name}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
                <Button type="button" variant="outline" size="sm" asChild>
                  <Link to="/memory-lanes/$id" params={{ id }} search={{ editing: false }}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          )}
        </div>
        {sessionData?.user?.id === data?.user?.id && !editing && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddMemoryDialog(true)}
              variant="default"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Memory
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/memory-lanes/$id" params={{ id }} search={{ editing: true }}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>
      {!hasMemories ? (
        <MemoryDetailsEmptyState id={id} />
      ) : (
        <div className="flex gap-20 justify-center w-full">
          <div className="flex flex-col gap-4 justify-start items-start mt-12">
            {data?.memories?.map((memory, index) => (
              <Polaroid
                hasSelection
                isSelected={revealedMemories.includes(index)}
                key={memory.id}
                src={memory.image}
                alt={memory.title}
                caption={memory.title}
                aspectRatio="square"
                className="max-w-80 max-h-96"
                rotate={index % 2 === 0 ? 10 : 20}
                onClick={() => {
                  if (!revealedMemories.includes(index)) {
                    setRevealedMemories(currentlySelectedIndexes => [...currentlySelectedIndexes, index]);
                  }
                  setSelectedMemory(index);
                }}
              />
            ))}

            {sessionData?.user?.id === data?.user?.id && (
              <Button
                onClick={() => setShowAddMemoryDialog(true)}
                variant="default"
                size="lg"
                className="flex gap-2 h-auto p-6 mx-auto mt-12"
              >
                <Plus className="h-8 w-8 " />
                <span className="">Add Memory</span>
              </Button>
            )}
          </div>
          {!isPending && (
            hasMemories && (
              <div className="flex flex-col gap-4 justify-start items-start mt-20 w-1/2">
                {!editing || !data?.memories[selectedMemory].id || !data?.memories[selectedMemory].title ? (
                  <MemoryDetails
                    title={data?.memories[selectedMemory].title ?? ""}
                    content={data?.memories[selectedMemory].content}
                    date={data?.memories[selectedMemory].date}
                  />
                ) : (
                  <MemoryDetailsForm
                    key={data?.memories[selectedMemory].id}
                    memoryLaneId={id}
                    id={data?.memories[selectedMemory].id}
                    values={{
                      title: data?.memories[selectedMemory].title ?? "",
                      content: data?.memories[selectedMemory].content,
                      date: data?.memories[selectedMemory].date?.toISOString(),
                    }}
                    onChange={(values) => {
                    }}
                    onSubmit={() => {
                    }}
                  />
                )}
              </div>
            ))}
        </div>
      )}

      {/* Add Memory Dialog */}
      <Dialog open={showAddMemoryDialog} onOpenChange={setShowAddMemoryDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <MemoryAdditionDialog.Header
            title={data?.name || "Memory Lane"}
            description="Add a new memory with photos, descriptions, and dates."
          />
          <MemoryAdditionDialog id={id} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
