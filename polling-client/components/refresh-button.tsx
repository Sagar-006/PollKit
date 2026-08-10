"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const RefreshButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="w-3.5 h-3.5 mr-2" />
      Refresh
    </Button>
  );
};

export default RefreshButton;
