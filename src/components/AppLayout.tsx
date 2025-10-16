import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Compass, Heart, LogIn, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { authClient } from "~/utils/auth";
import { CreateMemoryModal } from "./CreateMemoryModal";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-4 z-50 w-fit mx-auto rounded-md backdrop-blur bg-white">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-6 mr-4">
              <nav className="hidden md:flex items-center gap-4">
                <Button asChild size="default" variant="ghost">
                  <Link to="/">
                    <Compass className="h-4 w-4" />
                    Explore
                  </Link>
                </Button>
                {session.data ? (
                  <Button asChild size="default" variant="ghost">
                    <Link
                      to="/users/$id"
                      params={{ id: session.data?.user?.id }}
                    >
                      <Heart className="h-4 w-4" />
                      My Magic Memories
                    </Link>
                  </Button>
                ) : null}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="default"
                onClick={() => {
                  if (session.data) {
                    setIsCreateModalOpen(true);
                  } else {
                    navigate({ to: "/sign-up" });
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                Create Magic Memory
              </Button>
            </div>
            <div className="flex items-center gap-4 ml-4">
              {session.data ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.data.user?.image || undefined}
                          alt={session.data.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {getInitials(session.data.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.data.user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.data.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              {!session.data ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="p-2"
                    >
                      <Link to="/sign-in">
                        <LogIn className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-black drop-shadow-md">
                    <p>Sign in to your account</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">{children}</main>
        <CreateMemoryModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      </div>
    </TooltipProvider>
  );
}

