// app/api/auth/refreshtoken/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Get refresh token from the browser cookie
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No refresh token",
        },
        {
          status: 401,
        },
      );
    }

    // Call Express refresh endpoint
    const response = await fetch(`${process.env.API_URL}/auth/refreshtoken`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    console.log("Express refresh response:", data);

    // Forward Express error
    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    // Your Express ApiResponse.ok() returns:
    //
    // {
    //   success: true,
    //   message: "...",
    //   data: {
    //     accessToken: "...",
    //     refreshToken: "..."
    //   }
    // }

    if (!data.data) {
      console.error("Refresh response does not contain data:", data);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid refresh response",
        },
        {
          status: 500,
        },
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data;

    if (!accessToken || !newRefreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Tokens missing from refresh response",
        },
        {
          status: 500,
        },
      );
    }

    // Update browser cookies
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 30 seconds for testing
      path: "/",
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
