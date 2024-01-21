"use client";
import LoadingIndicator from "@/app/components/loading-indicator";
import { useAuth } from "@/lib/contexts/auth";
import { saveToken, verifyEmail } from "@/lib/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Verify email page
 */
export default function Verify({
  searchParams: { email, token },
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [phase, setPhase] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { saveUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    verifyEmail({
      email: email as string,
      token: token as string,
    })
      .then((data) => {
        console.log("DATA", data);
        return saveToken({ token: data.token, expires: data.tokenExpiresOn });
      })
      .then((d) => {
        console.log("token saved as cookie");
        saveUser(d);
        setPhase("success");
        router.replace('/organization/new')
      })
      .catch((e) => {
        setPhase("error");
      });
  }, [email, token, saveUser, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      {phase === "loading" && (
        <>
          <div className="mb-4">
            <LoadingIndicator />
          </div>
          <p>Verifying...</p>
        </>
      )}
      {phase === "error" && (
        <p>An error occurred. We could not complete your email verification</p>
      )}
      {phase === "success" && <p>Email verification complete!</p>}
    </div>
  );
}
