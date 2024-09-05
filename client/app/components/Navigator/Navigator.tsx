import Link from "next/link";

export default function Navigator() {
  return (
    <>
      <header className="bg-[#eeeff3] text-black font-medium py-4 px-6 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/" legacyBehavior>
            <a className="hover:underline">Home</a>
          </Link>
          <Link href="/login/operator" legacyBehavior>
            <a className="hover:underline">Operator</a>
          </Link>
          <Link href="/login/admin" legacyBehavior>
            <a className="hover:underline">Admin</a>
          </Link>
          <Link href="https://nielit.gov.in/" legacyBehavior>
            <a className="hover:underline">About</a>
          </Link>
          <Link href="https://nielit.gov.in/content/contact-us-1" legacyBehavior>
            <a className="hover:underline">Contact Us</a>
          </Link>
        </nav>
      </header>
    </>
  );
}