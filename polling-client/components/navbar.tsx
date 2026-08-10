import Link from "next/link";
import { LogOut, Plus, BarChart3, Vote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SignOutButton from "./signout";
import ThemeToggle from "./theme-toggle";
// import { ModeToggle } from "@/components/mode-toggle";

type NavbarProps = {
  email: string;
};

export function Navbar({ email }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Vote className="h-6 w-6 text-primary" />
            <span>Opinio</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Polls
              </Link>
            </Button>

            <Button asChild>
              <Link href="/create-poll">
                <Plus className="mr-2 h-4 w-4" />
                Create Poll
              </Link>
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}

          <ThemeToggle />

          <Separator orientation="vertical" className="h-6" />

          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">{email}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>

          <Avatar>
            <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}
