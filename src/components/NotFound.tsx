import { Link } from '@tanstack/react-router'
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Home, ArrowLeft, Camera } from "lucide-react";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full mx-auto">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="text-8xl font-bold text-muted-foreground/20 select-none">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/40" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Magic Memory Not Found</CardTitle>
            <CardDescription className="text-base">
              {children || (
                <>
                  This magical memory doesn't exist or has been moved.
                  <br />
                  Let's find your way back to your magical memories.
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button asChild variant="default">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Magic Memories
                </Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground pt-2">
              <p>
                Lost? Browse all available magical memories or create a new one
                to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
