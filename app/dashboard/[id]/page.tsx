"use client";
import Image from "next/image";
import Button from "../../components/button";
import { useAuth, useAuthRedirect } from "@/lib/contexts/auth";
import { useOrg } from "@/lib/contexts/org";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const { org } = useOrg();
  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium">Welcome, {user?.firstName}</h1>
        <p className="text-[#535353]">
          This is your hub for posting, editing, and growing your site.
        </p>
      </div>

      <div className="w-fit mt-10 border rounded-xl p-8 max-w-3xl">
        <div className="">
          {/* <div className="flex items-center gap-2"> */}

          <div className="flex">
            {/* <div className="flex justify-center items-center w-12 h-12 bg-opacity-20 bg-[#806CFA] rounded-full"> */}
            <div className="w-8 h-8 bg-[#806CFA] rounded-full flex justify-center items-center">
              <Image
                alt=""
                src="/images/bolt-white.svg"
                width={13.4}
                height={18}
              />
            </div>
            <div className="-ml-2 w-8 h-8 bg-[#499384] rounded-full flex justify-center items-center">
              <Image alt="" src="/images/bulb.svg" width={13.4} height={18} />
            </div>
            {/* </div> */}
          </div>
          <h3 className="mt-8 text-xl font-medium">Products</h3>
        </div>
        <p className="my-8">
          Create and manage an inventory of products and services.
        </p>
        <Link href={`/dashboard/${org?.id}/products`}>
          <Button className="">View products</Button>
        </Link>
      </div>
    </div>
  );
}
