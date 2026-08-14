import Link from "next/link";
import { LogOut, Plus, BarChart3, Vote, Menu } from "lucide-react"; // MOBILE MENU: added Menu icon for the hamburger trigger

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
// MOBILE MENU: dropdown primitives for the mobile-only menu (assumes shadcn dropdown-menu is set up at this path)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "./signout";
import ThemeToggle from "./theme-toggle";
// import { ModeToggle } from "@/components/mode-toggle";

type NavbarProps = {
  email: string;
};

export function Navbar({ email }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Vote className="h-6 w-6 text-primary" />
            <span>Opinio</span>
          </Link>

          {/* MOBILE MENU: removed "hidden md:flex" so Polls/Create Poll are visible at every width; text label hides below sm, icon stays */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4 sm:mr-2" />
                {/* MOBILE MENU: label hidden on the smallest screens to keep everything on one line */}
                <span className=" sm:inline">Polls</span>
              </Link>
            </Button>

            <Button size="sm" asChild>
              <Link href="/create-poll">
                <Plus className="h-4 w-4 sm:mr-2" />
                {/* MOBILE MENU: label hidden on the smallest screens to keep everything on one line */}
                <span className=" sm:inline">Create Poll</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* MOBILE MENU: desktop-only group — toggle, separator, email, avatar, sign out — unchanged content, just wrapped and hidden below md */}
          <div className="hidden items-center gap-4 md:flex">
            {/* <ModeToggle /> */}
            <ThemeToggle />

            <Separator orientation="vertical" className="h-6" />

            <div className="text-right">
              <p className="text-sm font-medium">{email}</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>

            <Avatar>
              <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <SignOutButton />
          </div>

          {/* MOBILE MENU: hamburger trigger, visible only below md, opens toggle/email/sign-out */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>

                <DropdownMenuSeparator />

                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar>
                    <AvatarFallback>
                      {email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium">{email}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <div className="px-2 py-1.5">
                  <SignOutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
