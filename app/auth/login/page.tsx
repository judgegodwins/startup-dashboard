"use client";
import { object } from "yup";
import { usePost } from "@/lib/hooks/apiHooks";
import { EmailSchema, PasswordSchema, RequiredSchema } from "@/lib/schema";
import { LoginResponse, User } from "@/lib/types/api";
import { useAlert } from "@/lib/contexts/alert";
import { Form, FormikProvider } from "formik";
import { saveToken } from "@/lib/services";
import { useAuth, useAuthRedirect } from "@/lib/contexts/auth";
import Link from "next/link";
import TextField from "@/app/components/textfield";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";

const initialValues = {
  email: "",
  password: "",
};

const Schema = object({
  email: RequiredSchema("Email is required"),
  password: PasswordSchema,
});

export default function Login() {
  useAuthRedirect({
    redirectLoggedIn: "/dashboard",
  });

  const { setAlert } = useAlert();
  const { saveUser } = useAuth();

  const { formik } = usePost<LoginResponse, typeof initialValues>({
    url: "/auth/login",
    enableReinitialize: true,
    initialValues,
    schema: Schema,
    onComplete: (data) => {
      console.log("data", data);
      saveToken({ token: data.token, expires: data.tokenExpiresOn }) // unix
        .then((d) => {
          console.log("token saved as cookie");
          saveUser(d);
        })
        .catch((e) => console.log("error saving token:", e));
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
          <h3 className="text-2xl font-bold mb-4">Login</h3>
          <div className="flex flex-col w-full gap-2">
            <TextField
              label="Email"
              id="email"
              type="email"
              {...getFieldProps("email")}
              error={touched.email && errors.email}
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
              {isSubmitting ? <LoadingIndicator /> : "Login"}
            </Button>
          </div>
          <p className="mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">Sign up</Link>
          </p>
        </div>
      </Form>
    </FormikProvider>
  );
}
