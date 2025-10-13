import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/memory-lanes/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/$id/edit"!</div>
}
