import { AlertCircle } from "lucide-react";

export const ErrorBox = ({ children }: { children: React.ReactNode }) => {
  if (!children) return null;
  return (
    <div className="bg-red-100 text-destructive text-sm p-3 rounded-md border border-destructive flex gap-2 items-center">
      <AlertCircle className="h-4 w-4" />
      {children}
    </div>
  );
};
