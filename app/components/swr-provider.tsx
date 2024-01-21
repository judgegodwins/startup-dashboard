"use client";
import { fetcher } from "@/lib";
import { useAuth } from "@/lib/contexts/auth";
import { DefaultProps } from "@/lib/types/props";
import { SWRConfig } from "swr";

const SWRProvider = ({ children }: DefaultProps) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;