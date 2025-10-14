import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '~/components/ui/shadcn-io/dropzone'
import { createMemoryFn, getMemoryByIdQueryOptions } from '~/utils/server/memories'
import { authClient } from '~/utils/auth'
import { ImageIcon, Plus, Trash2Icon } from 'lucide-react'
import { MemoryAdditionDialog } from '~/components/MemoryAdditionDialog'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '~/components/ui/dialog'

export const Route = createFileRoute('/memory-lanes/$id/edit')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { id } = params;
    await context.queryClient.ensureQueryData(getMemoryByIdQueryOptions(id));
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: memoryLane } = useQuery(getMemoryByIdQueryOptions(id))
  return (
    <div className="container max-w-2xl mx-auto py-10">
      {memoryLane && (
        <Dialog>
          <DialogTrigger>
            <Button variant="default" size="sm"><Plus className="h-4 w-4" /> Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <MemoryAdditionDialog.Header title={memoryLane?.name} description="Edit the memory with photos, descriptions, and dates." />
              <MemoryAdditionDialog id={id} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
