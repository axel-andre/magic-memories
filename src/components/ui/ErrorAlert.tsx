import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "~/lib/utils";

interface ErrorAlertProps {
  title?: string;
  message: string;
  variant?: "default" | "destructive";
  className?: string;
}

export function ErrorAlert({
  title,
  message,
  variant = "destructive",
  className,
}: ErrorAlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "default":
        return <Info className="h-4 w-4" />;
      case "destructive":
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant={variant} className={cn("", className)}>
      {getIcon()}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
