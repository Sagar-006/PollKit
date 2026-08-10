// lib/api.ts

export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  console.log("➡️ Sending request:", url);

  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  console.log("⬅️ Response status:", response.status);

  // Access token expired / missing
  if (response.status === 419) {
    console.log("🔄 Access token expired. Calling refresh...");

    const refreshResponse = await fetch("/api/auth/refreshtoken", {
      method: "POST",
      credentials: "include",
    });

    console.log("🔑 Refresh response:", refreshResponse.status);

    if (!refreshResponse.ok) {
      console.log("❌ Refresh failed");

      window.location.href = "/login";

      throw new Error("Session expired");
    }

    console.log("✅ Refresh successful. Retrying original request...");

    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    console.log("🔁 Retry response:", response.status);
  }

  return response;
}
