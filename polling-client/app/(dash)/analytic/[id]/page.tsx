import Analytic from "@/components/analytic";
import { serverFetch } from "@/lib/server-fetch";


interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageProps) {
  
  const {id} = await params;
  const res = await serverFetch(
    `${process.env.API_URL}/pooling/analytics/${id}`,
  );

  const data = await res.json();

  if (!data.result) {
    return <div>Analytics not found.</div>;
  }

  const { poll, optionsWithCount, totalVotes } = data.result;
  
  return (
    <div>
      <Analytic poll={poll} optionsWithCount={optionsWithCount} totalVotes={totalVotes}/>
    </div>
  );
}
