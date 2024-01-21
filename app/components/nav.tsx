"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({
  active,
  icon,
  text,
  matchExact,
  activeIcon,
  href,
}: {
  active?: boolean;
  activeIcon: string;
  matchExact?: boolean;
  icon: string;
  text: string;
  href: string;
}) {
  const pathname = usePathname();
  const match = matchExact ? href === pathname : pathname.includes(href);

  return (
    <li
      className={`relative ${
        match ? "bg-black text-white" : "text-black"
      } py-3 px-6 rounded-xl`}
    >
      <Link href={href} className="flex items-center gap-5">
        <Image
          alt=""
          src={match ? activeIcon : icon}
          width={17.78}
          height={18}
          className="w-[17.78px] h-[18px]"
        />
        <span className="font-medium">{text}</span>
      </Link>
    </li>
  );
}