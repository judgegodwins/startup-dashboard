"use client";
import Image from "next/image";
import { NavItem } from "../components/nav";
import LoadingIndicator from "../components/loading-indicator";
import { useAuthRedirect } from "@/lib/contexts/auth";
import { useOrgRedirect } from "@/lib/contexts/org";
import useSWR from "swr";
import { Organization } from "@/lib/types/api";
import Button from "../components/button";
import Link from "next/link";

export default function DashboardLobby({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { user, isReady, error } = useAuthRedirect({
    redirectLoggedOut: "/auth/login",
  });

  const {
    error: dError,
    isLoading,
    data,
  } = useSWR<Organization[]>(() => isReady ? "/auth/user/organizations" : null);

  console.log('LOBBY', isReady, user, error)

  // console.log('orgerror, error', orgError, error);
  if (error) {
    return <p>Something went wrong</p>;
  }

  if (!isReady) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        {error && <p>Failed to load organizations</p>}
        {isLoading && <LoadingIndicator />}
        {!error && !isLoading && data && (
          <div className="min-w-[50%]">
            <h1 className="ml-4 text-3xl font-bold mb-4">Your Organizations</h1>
            {data.map((org) => (
              <div key={org.id} className="p-4 flex justify-between items-center border-b">
                <p className="font-medium">{org.name}</p>
                <Link href={`/dashboard/${org.id}`}>
                  <Button>Launch Dashboard</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
