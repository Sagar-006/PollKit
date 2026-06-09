import { NextResponse,NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;

  // if no token and trying to access dashboard → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // allow request
}

// which routes to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-poll/:path*", // create poll page
    "/analytics/:path*",
  ],
  // ← protect all dashboard routes
};
