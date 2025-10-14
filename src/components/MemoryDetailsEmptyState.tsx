import { ImagePlus, Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"

export const MemoryDetailsEmptyState = ({ id }: { id: string }) => {
    return (
        <div className="flex flex-col gap-12 justify-start items-start mt-12 max-w-xl mx-auto">
            <Card className="w-full">
                <CardHeader className="items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <CardTitle>No memories yet</CardTitle>
                    <CardDescription>
                        This lane doesn’t have any memories. Add your first one to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild variant="default" size="sm">
                        <Link to="/memory-lanes/$id/edit" params={{ id }}>
                            <Plus className="h-4 w-4" /> Add Memory
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}