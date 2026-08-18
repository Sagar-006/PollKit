"use client";
import { Poll } from "@/types";
import Dashcard from "./dash-card";
import { useRouter } from "next/navigation";

interface PollListProps {
  polls:Poll[];
}
const DashboardComponent = ({polls}:PollListProps) => {
    const router = useRouter();

    const handleDelete = () => {
      router.refresh();
    }
  
  return (
    // RESPONSIVE: full width + horizontal padding so cards don't touch the screen edges on mobile
    <div className="w-full flex flex-col items-center px-4 sm:px-0">
      {polls.map((poll: Poll) => (
        <Dashcard {...poll} key={poll.id} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default DashboardComponent;