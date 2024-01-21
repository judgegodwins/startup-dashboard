"use client"
import { DefaultProps } from "@/lib/types/props";
import { Dispatch, FC, SetStateAction, createContext, useContext, useMemo, useState } from "react";

export type AlertType = {
  active: boolean;
  type: "success" | "error";
  message: string;
  duration: number;
};

interface AlertContextState {
  alert: AlertType;
  setAlert: Dispatch<SetStateAction<AlertType>>;
}

export const AlertContext = createContext<AlertContextState>({
  alert: {} as AlertType,
  setAlert: () => {},
});

export function AlertContextProvider(props: Pick<DefaultProps, "children">) {
  const [alert, setAlert] = useState<AlertType>({
    active: false,
    type: "success",
    message: "This is error",
    duration: 4000,
  });

  const value = useMemo(() => ({ alert, setAlert }), [alert]);

  return (
    <AlertContext.Provider value={value}>
      {props.children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("Need to wrap AlertContextProvider");
  return context;
};
