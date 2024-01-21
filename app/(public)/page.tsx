import Image from "next/image";
import Link from "next/link";
import Button from "../components/button";
import TextField from "../components/textfield";

function NavItem({ href, text }: { href: string; text: string }) {
  return (
    <li className="text-white">
      <Link href="/auth/login">
        <span>{text}</span>
      </Link>
    </li>
  );
}

export default function Home() {
  return (
    <div className="flex mt-12">
      <div className="pb-12 basis-1/2">
        <h1 className="text-5xl font-medium leading-[1.25]">
          Access to Dozens of Company Profiles
        </h1>
        <p className="text-xl mt-8 pr-24">
          Grow your business with all-in-one prospecting solutions powered by
          the leader in private-company data.
        </p>
        <div className="mt-8">
          <Link href="/search">
            <Button className="capitalize font-medium">START SEARCHING</Button>
          </Link>
        </div>
      </div>
      <div className="relative basis-1/2">
        <Image
          layout="fill"
          className="w-inherit"
          src="/images/undraw_search_engine.svg"
          alt="hero image"
        />
      </div>
    </div>
  );
}
