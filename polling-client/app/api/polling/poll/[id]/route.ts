// app/api/polling/poll/[id]/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(
      `${process.env.API_URL}/pooling/public/${id}`,
      {
        method: "GET",
        headers: {
          ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get Poll Route Error:", error);

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
