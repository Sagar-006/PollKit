// lib/server-fetch.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  // No access token → user is not authenticated
  if (!accessToken) {
    redirect("/login");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  // Access token expired
  if (response.status === 419) {
    redirect("/login");
  }

  return response;
}
