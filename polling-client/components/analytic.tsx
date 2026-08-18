// components/analytic.tsx
"use client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Option {
  optionId: string;
  optionText: string;
  count: number;
}

interface Poll {
  id: string;
  question: string;
  isActive: boolean;
  isPublished: boolean;
  anonymousVoting: boolean;
  createdAt: string;
  expiresAt: string;
}

interface AnalyticProps {
  poll: Poll;
  optionsWithCount: Option[];
  totalVotes:number;
}

const Analytic = ({ poll, optionsWithCount, totalVotes }: AnalyticProps) => {
  

  const formatDate = (dateStr: string) =>{
    return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
  }
    

  const getPercentage = (count: number) =>
    totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

  const isExpired = new Date(poll.expiresAt) < new Date();

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4 px-4">
      {/* Poll Info Card */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold capitalize">
              Q: {poll.question}
            </h2>
            <Badge
              variant={poll.isActive && !isExpired ? "default" : "destructive"}
            >
              {isExpired ? "Expired" : poll.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Dates */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>📅 Created: {formatDate(poll.createdAt)}</span>
            <span>⏰ Expires: {formatDate(poll.expiresAt)}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <Badge variant={poll.isPublished ? "default" : "secondary"}>
              {poll.isPublished ? "Published" : "Unpublished"}
            </Badge>
            <Badge variant="outline">
              {poll.anonymousVoting ? "Anonymous" : "Non-Anonymous"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Votes Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Results</h3>
            <span className="text-sm text-muted-foreground">
              Total Votes:{" "}
              <span className="font-bold text-foreground">{totalVotes}</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {optionsWithCount.map((option) => (
            <div key={option.optionId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium">
                  {option.optionText}
                </span>
                <span className="text-muted-foreground">
                  {option.count} votes ({getPercentage(option.count)}%)
                </span>
              </div>
              <Progress value={getPercentage(option.count)} className="h-3" />
            </div>
          ))}

          {totalVotes === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">
              No votes yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytic;
