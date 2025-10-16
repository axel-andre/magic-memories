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
          className: "bg-yellow-600 text-yellow-100",
        };
      case "published":
        return {
          label: "Published",
          variant: "default" as const,
          className: "bg-green-600 text-green-100",
        };
      case "archived":
        return {
          label: "Archived",
          variant: "outline" as const,
          className: "bg-gray-600 text-gray-100",
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
