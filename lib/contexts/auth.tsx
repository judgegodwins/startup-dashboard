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
import { SuccessDataResponse, User } from "../types/api";
import { ApiError } from "../errors";
import { useRouter } from "next/navigation";
import { InternalAxiosRequestConfig } from "axios";
import { deleteToken } from "../services";

interface AuthContextState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: Error | any | null;
  loggedOut: boolean;
  isReady: boolean;
  logout: () => Promise<void>;
  saveUser: (data: { user: User, token: string }) => void;
}

export function isAuthError(e: Error) {
  return Boolean(
    e &&
      (e as ApiError).statusCode &&
      [401, 403].includes((e as ApiError).statusCode)
  );
}

export const AuthContext = createContext<AuthContextState>({
  token: null,
  user: null,
  isLoading: false,
  loggedOut: false,
  error: null,
  isReady: false,
  logout: async () => {},
  saveUser: (d: { user: User, token: string }) => {},
});

export function AuthProvider(props: Pick<DefaultProps, "children">) {
  const { data, error, isLoading, mutate } = useSWR<{ user: User, token: string }>(
    "/api/token",
    proxy,
  );

  const [isReady, setIsReady] = useState(false);

  const logout = useCallback(
    function () {
      return deleteToken().then(() => {
        mutate(undefined);
      });
    },
    [mutate]
  );

  const saveUser = useCallback(
    function (d: { user: User, token: string }) {
      mutate(d);
    },
    [mutate]
  );

  const value = useMemo(
    () => ({
      user: data?.user || null,
      token: data?.token || null,
      loggedOut: isAuthError(error) && !isLoading,
      isLoading,
      error,
      logout,
      isReady,
      saveUser,
    }),
    [data, error, isLoading, logout, saveUser, isReady]
  );

  useEffect(() => {
    const int = axiosHttp.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${value?.token}`;
      return config;
    });

    if (value.user && value.token && !value.loggedOut) {
      setIsReady(true);
    }

    return () => {
      axiosHttp.interceptors.request.eject(int);
    };
  }, [value.token, value.user, value.loggedOut]);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Need to wrap AuthContextProvider");
  return context;
};

// used for routing to appropriate auth page
export const useAuthRedirect = ({
  redirectLoggedIn = "",
  redirectLoggedOut = "",
} = {}) => {
  const router = useRouter();

  const { user, error, loggedOut, isLoading, isReady } = useAuth();

  useEffect(() => {
    // if (fetch in progress, logged in or not) then don't do anything yet
    if (isLoading) return;

    if (loggedOut) {
      if (!redirectLoggedOut) return;
      router.push(redirectLoggedOut);
    } else {
      if (!redirectLoggedIn) return;
      router.push(redirectLoggedIn);
    }
  }, [user, redirectLoggedIn, redirectLoggedOut, isLoading, loggedOut, router]);

  return {user, error, isLoading, loggedOut, isReady}
};
