"use client";
import Image from "next/image";
import { NavItem } from "../../components/nav";
import LoadingIndicator from "../../components/loading-indicator";
import { useAuthRedirect } from "@/lib/contexts/auth";
import { useOrgRedirect } from "@/lib/contexts/org";
import Link from "next/link";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isReady: authReady,
    error,
  } = useAuthRedirect({
    redirectLoggedOut: "/auth/login",
  });

  const { org, isReady: orgReady, error: orgError } = useOrgRedirect();

  // console.log('orgerror, error', orgError, error);
  if (error || orgError) {
    return <p>Something went wrong</p>;
  }

  if (!authReady || !orgReady) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (user && org) {
    return (
      <div className="w-full h-screen flex">
        <div className="h-full flex flex-col border-r">
          <div className="px-[50px] py-[50px]">
            <Link href="/">
              <h3 className="text-xl font-bold">CompanyWise</h3>
            </Link>
          </div>

          <div className="pt-5 grow">
            <div className="px-[26px]">
              <ul>
                <NavItem
                  href={`/dashboard/${org.id}`}
                  text="Dashboard"
                  activeIcon="/images/home-active.svg"
                  icon="/images/home.svg"
                  matchExact
                />
                <NavItem
                  href={`/dashboard/${org.id}/products`}
                  text="Products & Services"
                  activeIcon="/images/products-active.svg"
                  icon="/images/products.svg"
                />
                <NavItem
                  href={`/dashboard/${org.id}/profile`}
                  text="Profile"
                  activeIcon="/images/company-svgrepo-active.svg"
                  icon="/images/company-svgrepo.svg"
                />
              </ul>
            </div>
          </div>
        </div>
        <div className="min-h-screen grow overflow-y-auto px-11">
          <div className="w-full flex items-center justify-end py-8 gap-12">
            <div className="flex items-center justify-between gap-6">
              <div className="w-12 h-12 bg-[#f4f4f4] rounded-full flex justify-center items-center">
                <Image src="/images/bolt.svg" width={18.4} height={22} alt="" />
              </div>
              <div className="w-12 h-12 bg-[#f4f4f4] rounded-full flex justify-center items-center">
                <Image src="/images/help.svg" width={18.4} height={22} alt="" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Image
                  alt=""
                  width={32}
                  height={32}
                  style={{
                    objectFit: "cover",
                  }}
                  src="/images/user.svg"
                />
              </div>
              <div>
                <span className="text-base font-medium text-[#535353]">{org.name}</span>
                <p className="text-sm">{user.firstName}</p>
              </div>
            </div>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }
}
