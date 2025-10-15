import React from "react";
import { Badge } from "./badge";

interface PublicationStatusBadgeProps {
  status: "draft" | "published" | "archived";
  className?: string;
}

export const PublicationStatusBadge: React.FC<PublicationStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "draft":
        return {
          label: "Draft",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "published":
        return {
          label: "Published",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "archived":
        return {
          label: "Archived",
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-600 border-gray-200",
        };
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          className: "",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};
