"use client";
import { omit } from "lodash";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import TextField, { TextArea } from "@/app/components/textfield";
import { useAlert } from "@/lib/contexts/alert";
import { useOrg } from "@/lib/contexts/org";
import { usePost } from "@/lib/hooks/apiHooks";
import { deleteToken, getSignedUrls, uploadFile } from "@/lib/services";
import { Organization, Product } from "@/lib/types/api";
import { Form, FormikProvider } from "formik";
import Image from "next/image";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import useSWR from "swr";
import { object, string } from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Schema = object({
  name: string().optional(),
  description: string().optional(),
  type: string().oneOf(["for-profit", "non-profit"]).nullable().optional(),
  industry: string().nullable().optional(),
  phoneNumber: string().nullable().optional(),
  email: string()
    .email("Your email must be a valid email")
    .nullable()
    .optional(),
});

async function upload(file: File) {
  const [{ key, url }] = await getSignedUrls(1);

  await uploadFile(url, file);

  return key;
}

export default function Profile() {
  const { org, error, saveOrg } = useOrg();
  const [disabled, setDisabled] = useState(true);

  const { setAlert } = useAlert();

  const initialValues = {
    name: org?.name,
    description: org?.description,
    yearFounded: org?.yearFounded,
    logoFile: undefined,
    type: org?.type || undefined,
    phoneNumber: org?.phoneNumber,
    email: org?.email,
    industry: org?.industry,
  };

  console.log("init", initialValues);

  const { formik } = usePost<Organization, typeof initialValues>({
    url: "/organization",
    enableReinitialize: true,
    initialValues,
    schema: Schema,
    type: "patch",
    modifyBefore: async (data) => {
      if (data.logoFile) {
        const key = await upload(data.logoFile);
        console.log("KEY", key);
        return {
          ...omit(data, ["logoFile"]),
          logo: key,
        };
      }

      return omit(data, ["logoFile"]);
    },
    onComplete: (data) => {
      console.log("data org updated", data);
      saveOrg(data);
      setDisabled(true);
      // router.push(`/dashboard/${org?.id}/products/details/${data.id}`);
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
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-7 items-center">
            <Image
              src={org?.logo || "/images/default_company.png"}
              alt="company logo"
              height={135}
              width={135}
              className="rounded-xl w-[135px] h-[135px]"
            />
            <div>
              <h1 className="text-3xl font-semibold text-t">{org?.name}</h1>
              <p className="text-textSecondary mt-2">Organization</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="mt-14 border-b pb-6">
            <h3 className="text-xl font-semibold">Company Profile</h3>
            <p className="text-sm mt-1 text-textSecondary">
              Update your public profile here.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (disabled) {
                  setDisabled(false);
                } else {
                  formik.resetForm();
                  setDisabled(true);
                }
              }}
            >
              {disabled ? "Edit" : "Cancel"}
            </Button>
            {!disabled && (
              <Button
                className="!bg-[rgba(0,0,0,.05)] !text-black"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingIndicator /> : "Update"}
              </Button>
            )}
          </div>
        </div>

        <div className="py-6 flex border-b gap-28">
          <div className="">
            <p className="font-semibold">Public Profile</p>
            <p className="text-textSecondary">
              This will be displayed on your profile.
            </p>
          </div>
          <div className="grow">
            <TextField
              disabled={disabled}
              className="w-1/2"
              label="Organization Name"
              id="name"
              {...getFieldProps("name")}
            />
            {/* <input type="text" /> */}
            <TextArea
              disabled={disabled}
              className="mt-4 w-1/2"
              label="Description"
              id="description"
              {...getFieldProps("description")}
            />
            <div className="w-full">
              <label htmlFor="yearFounded" className="block font-medium mt-4">
                Year Founded
              </label>
              <ReactDatePicker
                wrapperClassName="w-full"
                disabled={disabled}
                id="yearFounded"
                name="yearFounded"
                className="border-2 rounded-lg p-3 w-1/2"
                selected={
                  values.yearFounded ? new Date(values.yearFounded) : null
                }
                onChange={(date) =>
                  setFieldValue("yearFounded", date?.toISOString())
                }
              />
            </div>

            <label htmlFor="type" className="block mt-4 font-medium">
              Organization Type
            </label>
            <select
              disabled={disabled}
              className="p-3 w-1/2 cursor-pointer bg-white rounded-lg border-2"
              id="type"
              {...getFieldProps("type")}
              value={values.type === undefined ? "" : values.type}
              onChange={(e) => {
                const { value } = e.target;

                if (value === "") {
                  return setFieldValue("type", undefined);
                }
                setFieldValue("type", value);
              }}
            >
              <option value="for-profit">For Profit</option>
              <option value="not-for-profit">Non-Profit</option>
              <option value="">None Selected</option>
            </select>

            <TextField
              disabled={disabled}
              id="industry"
              label="Industry"
              className="mt-4 w-1/2"
              {...getFieldProps("industry")}
              error={touched.name && errors.name}
            />

            <label
              htmlFor="phoneNumber"
              className="block mt-4 mb-1 font-medium"
            >
              Phone Number
            </label>
            <PhoneInput
              disabled={disabled}
              country={"ng"}
              containerClass="!w-1/2"
              inputProps={{
                name: "phoneNumber",
              }}
              inputClass="!w-full !py-3"
              value={values.phoneNumber}
              onChange={(phone) => setFieldValue("phoneNumber", `+${phone}`)}
            />

            <TextField
              id="email"
              label="Contact Email"
              disabled={disabled}
              {...getFieldProps("email")}
              className="mt-4 w-1/2"
              error={touched.email && errors.email}
            />
          </div>
        </div>

        <div className="py-6 flex border-b gap-28">
          <div className="">
            <p className="font-semibold">Company Logo</p>
            <p className="text-textSecondary">Update your company logo.</p>
          </div>
          <div className="grow">
            <div className="">
              <label htmlFor="profileImage" className="mb-1 block font-medium">
                Logo
              </label>
              <input
                disabled={disabled}
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
            </div>
          </div>
        </div>
      </Form>
      <div className="my-6">
        <Button
          onClick={() => {
            deleteToken()
              .then(() => {
                window.location.reload();
              })
              .catch(console.log);
          }}
          className="bg-red-500"
        >
          Logout
        </Button>
      </div>
    </FormikProvider>
  );
}
