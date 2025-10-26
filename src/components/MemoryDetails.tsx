import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export type MemoryDetailsProps = {
    title: string;
    content?: string;
    date?: Date | string;
    className?: string;
};

function formatDateForDisplay(date?: Date | string) {
    if (!date) return "";
    const value = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(value.getTime())) return "";
    return value.toLocaleDateString();
}

export function MemoryDetails({ title, content, date, className }: MemoryDetailsProps) {
    return (
      <div className={cn("sticky top-28 w-full", className)}>
        <Card className="relative min-h-56 w-full bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold font-sans max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {content ? (
              <p className="text-sm text-muted-foreground max-w-full break-words pb-4">
                {content}
              </p>
            ) : null}
            {date ? (
              <span className="text-xs text-muted-foreground inline-block absolute bottom-4 left-4">
                {formatDateForDisplay(date)}
              </span>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
}


