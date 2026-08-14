import DashboardComponent from "@/components/dashboard-component";
import { serverFetch } from "@/lib/server-fetch";

export default async function Dashboard() {
  const res = await serverFetch(`${process.env.API_URL}/pooling/allpools`);
  const data = await res.json();

  if (!data.result || data.result.length === 0) {
    return (
      // RESPONSIVE: horizontal padding so the empty state isn't flush against screen edges on mobile
      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <h1>No polls.</h1>
      </div>
    );
  }

  return (
    <div>
      {/* RESPONSIVE: reduced top margin on mobile, back to mt-10 from sm up */}
      <div className="flex flex-col mt-6 sm:mt-10 gap-6 justify-center items-center">
        <DashboardComponent polls={data.result} />
      </div>
    </div>
  );
}
