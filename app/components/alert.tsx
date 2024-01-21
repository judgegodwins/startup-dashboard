"use client"
import { useEffect, useState } from "react";
import { useAlert } from "@/lib/contexts/alert";
import { AlertTypeEnum } from "@/lib/types/enums"; 
import Image from "next/image";
// import { CheckIcon } from "@heroicons/react/24/solid";

// import checkIcon from "@/public/check.svg";
// import errorIcon from "@/public/error.svg";

export type alertType = {
  active: boolean;
  type: "success" | "error";
  message: string;
  duration: number;
};

const mapAlertStatus = {
  [AlertTypeEnum.SUCCESS]:
    "!text-green-900 !bg-green-200 !border-green-400 !shadow-green-600/20",
  [AlertTypeEnum.ERROR]:
    "!text-red-900 !bg-red-200 !border-red-400 !shadow-red-600/20",
};

const mapAlertIconStatus = {
  [AlertTypeEnum.SUCCESS]:
    "!bg-green-400 !border-green-500 !text-green-100 !shadow-green-100",
  [AlertTypeEnum.ERROR]:
    "!bg-red-400 !border-red-500 !text-red-100 !shadow-red-100",
};

export default function Alert() {
  const { alert, setAlert } = useAlert();

  useEffect(() => {
    setTimeout(() => {
      setAlert((prevState) => {
        return {
          ...prevState,
          active: false,
        };
      });
    }, alert.duration);
  }, [alert.active, alert.duration, setAlert]);

  return (
    <div
      className={`z-50 hidden fixed top-5 right-5 p-4 min-w-[12rem] bg-slate-50 border border-slate-200 shadow-xl shadow-slate-800/20 rounded-xl ${
        alert.active ? "!block" : ""
      } ${mapAlertStatus[alert.type]}`}
    >
      <div className="flex items-center gap-4 font-semibold text-lg">
        {/* <div
          className={`flex items-center justify-center p-1.5 w-fit bg-slate-100 border border-slate-200 rounded-lg shadow-inner shadow-slate-50 ${
            mapAlertIconStatus[alert.type]
          }`}
        >
          <Image
            width={24}
            height={24}
            priority
            src={alert.type === "success" ? checkIcon : errorIcon}
            alt="alert icon"
          />
        </div> */}
        <span className="text">{alert.message}</span>
      </div>
    </div>
  );
}
