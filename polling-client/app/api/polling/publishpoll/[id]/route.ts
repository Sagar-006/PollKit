// app/api/polling/publishpoll/[id]/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Access token missing",
        },
        { status: 419 },
      );
    }

    console.log("Publish URL:", `${process.env.API_URL}/pooling/publish/${id}`);

    const response = await fetch(
      `${process.env.API_URL}/pooling/publish/${id}`,
      {
        method: "PATCH",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const text = await response.text();

    console.log("================================");
    console.log(
      "Express publish URL:",
      `${process.env.API_URL}/pooling/publish/${id}`,
    );
    console.log("Express publish status:", response.status);
    console.log(
      "Express publish content-type:",
      response.headers.get("content-type"),
    );
    console.log("Express publish response:", text);
    console.log("================================");

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/plain",
      },
    });
  } catch (error) {
    console.error("Publish Poll Route Error:", error);

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
