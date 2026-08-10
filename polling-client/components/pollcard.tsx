"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { fetchWithRefresh } from "@/lib/api";

interface PollOption {
  id: string;
  option: string;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  expiresAt: Date | string; // CHANGED: accept string too because API usually returns ISO string
  pollid: string;
  anonymousVoting: boolean;
}

export function PollCard({
  question,
  options,
  expiresAt,
  pollid,
  anonymousVoting,
}: PollCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voteMessage, setVoteMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selected) return;

    try {
      setLoading(true);

      const response = await fetchWithRefresh(
        `/api/polling/votepoll/${pollid}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            optionId: selected,
          }),
        },
      );

      // CHANGED:
      // Read the response only once.
      const data = await response.json();

          console.log(
            "data after vote the poll, and in the nextjs frontend! ",
            data,
          );

          const message = data?.result?.message; // ← get message
          setVoteMessage(message);   

      // User is not logged in

      
      setVoted(true);
    } catch (error) {
      console.error("Vote error:", error);

      setVoteMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Login required
  if (voteMessage === "login required") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold">Login required</h2>

          <p className="text-sm text-muted-foreground">
            This poll requires you to login to vote.
          </p>

          <a href={`/login?redirect=/poll/${pollid}`} className="block">
            <Button className="w-full">Login to vote</Button>
          </a>
        </div>
      </div>
    );
  }

  // Vote successful
  if (voteMessage === "vote successfully") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold">Vote submitted!</h2>

          <p className="text-sm text-muted-foreground mt-2">
            Thank you for voting.
          </p>
        </div>
      </div>
    );
  }

  // Poll closed
  if (voteMessage === "Poll is no longer accepting votes") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold">Poll is closed!</h2>

          <p className="text-sm text-muted-foreground mt-2">
            Thank you for visiting.
          </p>
        </div>
      </div>
    );
  }

  // Already voted
  if (voteMessage === "you already voted") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold">You already voted</h2>

          <p className="text-sm text-muted-foreground mt-2">
            You already voted for this poll.
          </p>
        </div>
      </div>
    );
  }

  // Generic error
  if (voteMessage === "Something went wrong") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold">Something went wrong</h2>

          <p className="text-sm text-muted-foreground mt-2">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-md bg-background border rounded-2xl p-6">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold">{question}</h2>

          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            {expiresAt && (
              <span>{format(new Date(expiresAt), "MMM d, hh:mm a")}</span>
            )}

            {anonymousVoting && (
              <span className="px-2 py-1 rounded-md bg-muted text-xs">
                Anonymous
              </span>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-5">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 border rounded-md px-3.5 py-2.5 cursor-pointer transition-colors ${
                selected === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name={`poll-option-${pollid}`}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="accent-primary"
              />

              <span className="text-sm">{opt.option}</span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <Button
          type="button"
          className="w-full h-10"
          disabled={!selected || loading || voted}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit vote"}
        </Button>
      </div>
    </div>
  );
}
