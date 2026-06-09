import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>home page</h2>
      <nav className="flex gap-4">
        <Link href="/signup">
          Signup
        </Link>
        <Link href="/login">
          Login
        </Link>
      </nav>
    </div>
  );
}
