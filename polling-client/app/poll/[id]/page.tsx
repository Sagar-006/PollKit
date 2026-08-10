import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/pollcard";
import PollResults from "@/components/poll-results";
import RefreshButton from "@/components/refresh-button";

export default async function Vote({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.API_URL}/pooling/public/${id}`, {
    method: "GET",
    headers: {
      ...(accessToken
        ? {
            Cookie: `accessToken=${accessToken}`,
          }
        : {}),
    },
    cache: "no-store",
  });

  // if (!res.ok) {
  //   return (
  //     <div className="flex justify-center py-8 px-4">
  //       <h1>Poll not found.</h1>
  //     </div>
  //   );
  // }

  const data = await res.json();

  // if (!data.result?.poll) {
  //   return (
  //     <div className="flex justify-center py-8 px-4">
  //       <h1>Poll not found.</h1>
  //     </div>
  //   );
  // }

  // Login required for non-anonymous polls
  if (!data.result.poll?.anonymousVoting && !accessToken) {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold">Login required</h2>

          <p className="text-sm text-muted-foreground">
            This poll requires you to login to vote.
          </p>

          <Link href={`/login?redirect=/poll/${id}`}>
            <Button className="w-full">Login to vote</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (data.result.status === "pending") {
    return (
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-md bg-background border rounded-2xl p-6 text-center space-y-2">
          <h2 className="text-lg font-semibold">Poll Expired</h2>

          <p className="text-sm text-muted-foreground">
            This poll has expired. Results will appear once published.
          </p>

          <RefreshButton />
        </div>
      </div>
    );
  }

  if (data.result.status === "closed") {
    return <PollResults result={data.result.result} />;
  }

  return (
    <PollCard
      question={data.result.poll.question}
      expiresAt={data.result.poll.expiresAt}
      options={data.result.pollOptions}
      pollid={id}
      anonymousVoting={data.result.poll.anonymousVoting}
    />
  );
}
