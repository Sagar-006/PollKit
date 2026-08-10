// components/poll-results.tsx
import { Progress } from "@/components/ui/progress";

interface Option {
  optionId: string;
  optionText: string;
  count: number;
}

interface PollResultProps {
  result: {
    poll: { question: string };
    totalVotes: number;
    optionsWithCount: Option[];
  };
}

const PollResults = ({ result }: PollResultProps) => {
  const { poll, totalVotes, optionsWithCount } = result;

  const getPercentage = (count: number) =>
    totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-md bg-background border rounded-2xl p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Poll closed · Results
          </p>
          <h2 className="text-lg font-semibold capitalize">{poll.question}</h2>
          <p className="text-sm text-muted-foreground">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"} total
          </p>
        </div>

        {/* Options with progress */}
        <div className="space-y-4">
          {optionsWithCount.map((option) => {
            const pct = getPercentage(option.count);
            const isWinner =
              option.count ===
              Math.max(...optionsWithCount.map((o) => o.count));

            return (
              <div key={option.optionId} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span
                    className={`capitalize ${isWinner ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {option.optionText}
                    {isWinner && totalVotes > 0 && (
                      <span className="ml-2 text-xs text-primary">
                        👑 Leading
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground">
                    {option.count} votes ({pct}%)
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </div>

        {totalVotes === 0 && (
          <p className="text-center text-sm text-muted-foreground py-2">
            No votes were cast.
          </p>
        )}
      </div>
    </div>
  );
};

export default PollResults;
