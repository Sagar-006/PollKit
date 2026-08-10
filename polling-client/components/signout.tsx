"use client";

import { Button } from "@/components/ui/button";
import { fetchWithRefresh } from "@/lib/api";
import { signOutAction } from "@/lib/signout";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const signout = await fetchWithRefresh("/api/auth/signout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })

           console.log("res of signout in ",signout) 
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4 " />
      Sign Out
    </Button>
  );
}
