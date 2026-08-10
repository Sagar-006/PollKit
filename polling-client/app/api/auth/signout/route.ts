import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Call Express logout endpoint
    const response = await fetch(`${process.env.API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: [
          accessToken ? `accessToken=${accessToken}` : "",
          refreshToken ? `refreshToken=${refreshToken}` : "",
        ]
          .filter(Boolean)
          .join("; "),
      },
      cache: "no-store",
    });

    let data: any = null;

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    }

    // Always clear browser cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Logout failed",
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Logout successful",
    });
  } catch (error) {
    console.error("Signout Route Error:", error);

    // Even if Express is down, clear the browser cookies.
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
