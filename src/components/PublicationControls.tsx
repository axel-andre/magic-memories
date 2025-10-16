import { memo, useCallback } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { PublicationStatusBadge } from "./ui/PublicationStatusBadge";
import { MoreVertical, Globe, EyeOff, Archive, Edit3 } from "lucide-react";

interface PublicationControlsProps {
  currentStatus: "draft" | "published" | "archived";
  isOwner: boolean;
  onStatusChange: (status: "draft" | "published" | "archived") => void;
  onEdit: () => void;
  className?: string;
  isLoading?: boolean;
}

export const PublicationControls = memo<PublicationControlsProps>(
  ({
    currentStatus,
    isOwner,
    onStatusChange,
    onEdit,
    className = "",
    isLoading = false,
  }) => {
    const handlePublish = useCallback(() => {
      onStatusChange("published");
    }, [onStatusChange]);

    const handleUnpublish = useCallback(() => {
      onStatusChange("draft");
    }, [onStatusChange]);

    const handleDelete = useCallback(() => {
      onStatusChange("archived");
    }, [onStatusChange]);

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <PublicationStatusBadge isOwner={isOwner} status={currentStatus} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Publication options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {currentStatus === "draft" && (
              <DropdownMenuItem onClick={handlePublish} disabled={isLoading}>
                <Globe className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}

            {currentStatus === "published" && (
              <DropdownMenuItem onClick={handleUnpublish} disabled={isLoading}>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            )}

            {currentStatus !== "archived" && (
              <DropdownMenuItem onClick={handleDelete} disabled={isLoading}>
                <Archive className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onEdit} disabled={isLoading}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

PublicationControls.displayName = "PublicationControls";
