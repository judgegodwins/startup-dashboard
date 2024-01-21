"use client";
import { object, string } from "yup";
import { omit } from "lodash";
import { usePost } from "@/lib/hooks/apiHooks";
import { EmailSchema, PasswordSchema, RequiredSchema } from "@/lib/schema";
import { LoginResponse, Organization, User } from "@/lib/types/api";
import { useAlert } from "@/lib/contexts/alert";
import { Form, FormikProvider } from "formik";
import { getSignedUrls, uploadFile } from "@/lib/services";
import { useAuthRedirect } from "@/lib/contexts/auth";
import TextField, { TextArea } from "@/app/components/textfield";
import ReactDatePicker from "react-datepicker";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const initialValues = {
  name: "",
  description: "",
  yearFounded: new Date().toISOString(),
  logo: undefined,
  logoFile: undefined,
  type: "for-profit",
  phoneNumber: undefined,
  email: undefined,
  industry: undefined,
};

const Schema = object({
  name: RequiredSchema("Organization name is required"),
  description: RequiredSchema("Description is required"),
  yearFounded: RequiredSchema("Year founded is required"),
  type: string().oneOf(["for-profit", "non-profit"]).optional(),
  industry: string().optional(),
  phoneNumber: string().optional(),
  email: string().email("Your email must be a valid email").optional(),
});

async function upload(file: File) {
  const [{ key, url }] = await getSignedUrls(1);

  await uploadFile(url, file);

  return key;
}

export default function NewOrganization() {
  const { isReady, error } = useAuthRedirect({
    redirectLoggedOut: "/auth/login",
  });

  const router = useRouter();

  const { setAlert } = useAlert();

  const { formik } = usePost<Organization, typeof initialValues>({
    url: "/organization",
    enableReinitialize: true,
    initialValues,
    schema: Schema,
    modifyBefore: async (data) => {
      if (data.logoFile) {
        const key = await upload(data.logoFile);
        return {
          ...omit(data, ["logoFile"]),
          logo: key,
        };
      }

      return omit(data, ["logoFile"]);
      // await
    },
    onComplete: (data) => {
      console.log("RETURNED DATA", data);
      router.replace(`/dashboard/${data.id}`);
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

  const {
    values,
    errors,
    touched,
    submitForm,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (!isReady) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  console.log("errors", errors);
  return (
    <FormikProvider value={formik}>
      <Form
        className="max-w-full w-full h-screen flex flex-col items-center overflow-y-auto pt-[20px]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold">Create an Organization</h1>

        <div className="flex justify-center items-start gap-14 p-4 min-w-[40%]">
          {/* <div className="">
            <div className="w-20 h-20 bg-black rounded-full">
              <Image />
            </div>
          </div> */}
          <div className="flex flex-col w-full gap-2">
            <TextField
              id="name"
              label="Organization Name"
              {...getFieldProps("name")}
              error={touched.name && errors.name}
            />

            <TextArea
              label="Description"
              className="w-full mt-2"
              {...getFieldProps("description")}
              id="description"
              error={touched.description && errors.description}
            />

            <label htmlFor="yearFounded" className="block mt-2 font-medium">
              Year Founded
            </label>
            <ReactDatePicker
              id="yearFounded"
              name="yearFounded"
              className="border-2 rounded-lg p-3 w-full"
              selected={new Date(values.yearFounded)}
              onChange={(date) =>
                setFieldValue("yearFounded", date?.toISOString())
              }
            />

            <label
              htmlFor="profileImage"
              className="block mt-2 mb-1 font-medium"
            >
              Logo
            </label>
            <input
              name="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const { files } = e.target;

                if (files && files?.length > 0)
                  setFieldValue("logoFile", files[0]);
              }}
              className="border-2 rounded-lg p-4"
              id="logo"
            />

            <label htmlFor="type" className="block mt-2 font-medium">
              Organization Type
            </label>
            <select
              className="p-3 cursor-pointer bg-white rounded-lg border-2"
              id="type"
              {...getFieldProps("type")}
            >
              <option value="for-profit">For Profit</option>
              <option value="not-for-profit">Non-Profit</option>
            </select>
            {touched.type && errors.type && (
              <span className="text-sm text-red-500 mt-0.5">{errors.type}</span>
            )}

            <TextField
              id="industry"
              label="Industry"
              {...getFieldProps("industry")}
              error={touched.industry && errors.industry}
            />

            <label
              htmlFor="phoneNumber"
              className="block mt-2 mb-1 font-medium"
            >
              Phone Number
            </label>
            <PhoneInput
              country={"ng"}
              containerClass="w-full"
              inputProps={{
                name: "phoneNumber",
              }}
              inputClass="!w-full !py-3"
              value={values.phoneNumber}
              onChange={(phone) =>
                setFieldValue("phoneNumber", phone ? `+${phone}` : undefined)
              }
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <span className="text-sm text-red-500 mt-0.5">{errors.phoneNumber}</span>
            )}

            <TextField
              id="email"
              label="Contact Email"
              {...getFieldProps("email")}
              className="mt-2"
              error={touched.email && errors.email}
            />

            <Button className="mt-4 mb-8" type="submit">
              {isSubmitting ? (
                <LoadingIndicator height={14} width={14} />
              ) : (
                "Create Organization"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
}
