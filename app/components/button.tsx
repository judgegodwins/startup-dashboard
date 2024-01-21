import { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from "react";

export default function Button(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button {...props} className={`p-4 bg-black text-white rounded-xl text-sm leading-3 flex justify-center items-center ${props.className}`}>
      {props.children}
    </button>
  )
}