// app/api/polling/poll/[pollId]/vote/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    pollid: string;
  }>;
}

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { pollid } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const body = await req.json();

    const alreadyVotedCookie = cookieStore.get(`voted-${pollid}`)?.value;
    if (alreadyVotedCookie) {
      return NextResponse.json(
        { result: { message: "you already voted" } },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${process.env.API_URL}/pooling/poll/${pollid}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Cookie: `accessToken=${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    console.log("data after vote the poll, and in the nextjs backend! ",data);

const nextResponse = NextResponse.json(data, {
  status: response.status,
});

if (data.result.message === "vote successfully") {
  nextResponse.cookies.set(`voted-${data.result.result.pollId}`, "true", {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
}

  return nextResponse
  } catch (error) {
    console.error("Vote Poll Route Error:", error);

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
