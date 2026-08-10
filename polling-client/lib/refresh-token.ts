// lib/refresh-token.ts

import { cookies } from "next/headers";

export async function refreshTokens() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return false;
  }

  const response = await fetch(`${process.env.API_URL}/auth/refreshtoken`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();

  const { accessToken, refreshToken: newRefreshToken } = data.result;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });

  cookieStore.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return true;
}
