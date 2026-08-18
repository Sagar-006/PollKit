// lib/api.ts

export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {},
): Promise<Response> {

  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });


  // Access token expired / missing
  if (response.status === 419) {

    const refreshResponse = await fetch("/api/auth/refreshtoken", {
      method: "POST",
      credentials: "include",
    });


    if (!refreshResponse.ok) {

      window.location.href = "/login";

      throw new Error("Session expired");
    }


    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });

  }

  return response;
}
