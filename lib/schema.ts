import { string } from "yup";

export const PasswordSchema = string()
  .required("Password is required")
  .min(6, "Your password should contain at least 6 characters");

export const EmailSchema = string()
  .required("Email is required")
  .email("Invalid email format");

export const RequiredSchema = (msg?: string) =>
  string().required(msg || "This is required");

export const PasswordNoLengthSchema = string().required("Password is required");
