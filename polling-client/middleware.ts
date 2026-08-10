import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];

const privateRoutes = ["/dashboard", "/create-poll", "/analytic"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // --------------------------------------------------
  // 1. User has no tokens
  // --------------------------------------------------

  if (!accessToken && !refreshToken) {
    if (isPrivateRoute) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // --------------------------------------------------
  // 2. User has refresh token but access token expired
  // --------------------------------------------------

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await fetch(
        `${process.env.API_URL}/auth/refreshtoken`,
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        },
      );

      if (!refreshResponse.ok) {
        const response = NextResponse.redirect(new URL("/login", request.url));

        // Remove invalid refresh token
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
      }

      const data = await refreshResponse.json();


      const newAccessToken = data.data?.accessToken;
      const newRefreshToken = data.data?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        const response = NextResponse.redirect(new URL("/login", request.url));

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
      }

      // Continue the original request
      const response = NextResponse.next();

      // Set new access token
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30, // testing: 30 seconds
        path: "/",
      });

      // Set new refresh token
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60, // testing: 60 seconds
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Proxy refresh error:", error);

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // --------------------------------------------------
  // 3. Logged-in user trying to access login/signup
  // --------------------------------------------------

 if (accessToken && isPublicRoute) {
   const redirectPath = request.nextUrl.searchParams.get("redirect");

   if (redirectPath) {
     return NextResponse.redirect(new URL(redirectPath, request.url));
   }

   return NextResponse.redirect(new URL("/dashboard", request.url));
 }

  // --------------------------------------------------
  // 4. Access token exists
  // --------------------------------------------------

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/create-poll/:path*",
    "/analytic/:path*",
    "/poll/:path*",
  ],
};
