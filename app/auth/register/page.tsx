"use client";
import { object } from "yup";
import { usePost } from "@/lib/hooks/apiHooks";
import { PasswordSchema, RequiredSchema } from "@/lib/schema";
import { LoginResponse } from "@/lib/types/api";
import { useAlert } from "@/lib/contexts/alert";
import { Form, FormikProvider } from "formik";
import { useAuthRedirect } from "@/lib/contexts/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@/app/components/textfield";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";

const initialValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

const Schema = object({
  email: RequiredSchema("Email is required"),
  password: PasswordSchema,
  firstName: RequiredSchema("First name is required"),
  lastName: RequiredSchema("Last name is required"),
});

export default function Signup() {
  useAuthRedirect({
    redirectLoggedIn: "/dashboard",
  });

  const { setAlert } = useAlert();

  const router = useRouter();

  const { formik } = usePost<LoginResponse, typeof initialValues>({
    url: "/auth/register",
    enableReinitialize: true,
    initialValues,
    schema: Schema,
    onComplete: (data) => {
      router.replace("/auth/verify-message");
      // mutateUser(data.user).then(() => {
      //   router.replace("/dashboard");
      // });
    },
    onError: (e) => {
      setAlert((prev) => ({
        ...prev,
        active: true,
        type: "error",
        message: e.message,
      }));
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        autoComplete="off"
        className="w-full min-h-screen flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="min-w-[30%]">
          <h3 className="text-2xl font-bold mb-4">Sign-up</h3>
          <div className="flex flex-col w-full gap-2">
            <TextField
              label="Email"
              id="email"
              type="email"
              {...getFieldProps("email")}
              error={touched.email && errors.email}
            />
            <TextField
              label="First Name"
              id="firstName"
              type="firstName"
              {...getFieldProps("firstName")}
              error={touched.firstName && errors.firstName}
            />
            <TextField
              label="First Name"
              id="lastName"
              type="lastName"
              {...getFieldProps("lastName")}
              error={touched.lastName && errors.lastName}
            />
            <TextField
              label="Password"
              id="password"
              type="password"
              className="mt-4"
              {...getFieldProps("password")}
              error={touched.password && errors.password}
            />
            <Button className="mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoadingIndicator /> : "Sign up"}
            </Button>
          </div>
          <p className="mt-6">
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </Form>
    </FormikProvider>
  );
}
