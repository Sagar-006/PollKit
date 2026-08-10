import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import { Navbar } from "@/components/navbar";

interface JwtPayload {
  email: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ read cookie and decode email ONCE for all pages
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let email = "";

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      email = decoded.email;
    } catch {
      email = "";
    }
  }

  return (
    <>
      <Navbar email={email} /> {/* ✅ email passed once, works for all pages */}
      <main>{children}</main>
    </>
  );
}
