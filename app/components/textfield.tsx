import { omit } from "lodash";
import { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  inLabel?: string;
  placeholder?: string
  error?: string | false;
};

export default function TextField(props: TextFieldProps) {
  return (
    <div className={props.className}>
      {props.label && (
        <label htmlFor={props.id} className="block font-medium mb-1">
          {props.label}
        </label>
      )}
      <div
        className={`flex border-2 ${
          props.error ? "border-red-500" : ""
        } rounded-lg`}
      >
        {props.inLabel && (
          <div className="p-3 border-r-2">
            <span className="text-textSecondary">{props.inLabel}</span>
          </div>
        )}
        <input
          {...omit(props, ["className"])}
          placeholder={props.placeholder}
          className="outline-none p-3 rounded-lg w-full"
        />
      </div>
      {props.error && (
        <span className="text-sm text-red-500 mt-0.5">{props.error}</span>
      )}
    </div>
  );
}

type TextAreaProps = InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  inLabel?: string;
  error?: string | false;
};

export function TextArea(props: TextAreaProps) {
  return (
    <div className={props.className}>
      <label htmlFor={props.id} className="block mb-1 font-medium">
        {props.label}
      </label>
      <textarea
        {...omit(props, ["className"])}
        className={`border-2 p-3 rounded-lg w-full outline-none ${
          props.error ? "border-red-500" : ""
        }`}
        id="description"
        cols={30}
        rows={10}
      />
      {props.error && (
        <span className="text-sm text-red-500 mt-0.5">{props.error}</span>
      )}
    </div>
  );
}
