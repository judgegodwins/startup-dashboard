"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DefaultProps } from "../types/props";
import useSWR from "swr";
import { axiosHttp, proxy } from "..";
import { Organization, SuccessDataResponse, User } from "../types/api";
import { ApiError } from "../errors";
import { useParams, usePathname, useRouter } from "next/navigation";
import { InternalAxiosRequestConfig } from "axios";
import { deleteToken } from "../services";
import { useAuth } from "./auth";

interface AuthContextState {
  org: Organization | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | any | null;
  saveOrg: (d: Organization) => void;
}

export const OrgContext = createContext<AuthContextState>({
  org: null,
  isLoading: false,
  error: null,
  isReady: false,
  saveOrg: (d: Organization) => {}
});

export function OrgProvider(props: Pick<DefaultProps, "children">) {
  const p = useParams();
  const {isReady: authReady, token} = useAuth();
  const { data, error, isLoading, mutate } = useSWR<Organization>(() => authReady && p.id ? `/organization/details/${p.id}` : null);

  const [isReady, setIsReady] = useState(false);

  const saveOrg = useCallback(
    function (d: Organization) {
      mutate(d);
    },
    [mutate]
  );

  const value = useMemo(
    () => ({
      org: data || null,
      isLoading,
      error,
      isReady,
      saveOrg,
    }),
    [data, error, isLoading, isReady, saveOrg],
  );

  useEffect(() => {
    const int = axiosHttp.interceptors.request.use((config) => {
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-org-id'] = value.org?.id;
      return config;
    });

    if (value.org && !value.error && !value.isLoading) {
      setIsReady(true);
    }

    return () => {
      axiosHttp.interceptors.request.eject(int);
    };
  }, [value.org, token, value.isLoading, value.error]);

  return (
    <OrgContext.Provider value={value}>{props.children}</OrgContext.Provider>
  );
}

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) throw new Error("Need to wrap AuthContextProvider");
  return context;
};

// used for routing to appropriate auth page
export const useOrgRedirect = () => {
  const router = useRouter();

  const data = useOrg();

  useEffect(() => {
    // if (fetch in progress, logged in or not) then don't do anything yet
    if (data.error) {
      router.replace('/dashboard')
    }
  }, [data.error, router]);

  return data;
};
