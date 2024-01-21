import Link from "next/link";

function NavItem({ href, text }: { href: string; text: string }) {
  return (
    <li className="text-white">
      <Link href="/auth/login">
        <span>{text}</span>
      </Link>
    </li>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full">
      <div className="flex items-center justify-between px-8 py-4 w-full bg-black">
        <div className="flex">
          <Link href="/">
            <h3 className="text-xl font-bold text-white">CompanyWise</h3>
          </Link>
        </div>

        <div>
          <ul className="flex gap-4">
            <NavItem text="Login" href="/auth/login" />
            <NavItem text="Signup" href="/auth/signup" />
            {/* <li>
            <Link href="/auth/signup">
              <span className="text-white">Sign up</span>
            </Link>
          </li> */}
          </ul>
        </div>
      </div>

      <div className="container mx-auto">{children}</div>
    </main>
  );
}
