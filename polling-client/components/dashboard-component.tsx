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
    <div>
      {polls.map((poll:Poll) => (
        <Dashcard {...poll} key={poll.id} onDelete={handleDelete}/>
      ))}
    </div>
  )
}

export default DashboardComponent;
