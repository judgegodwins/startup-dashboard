"use client";
import { array, object, string } from "yup";
import { omit } from "lodash";
import { usePost } from "@/lib/hooks/apiHooks";
import { RequiredSchema } from "@/lib/schema";
import { Organization, Product, User } from "@/lib/types/api";
import { useAlert } from "@/lib/contexts/alert";
import { Form, FormikProvider } from "formik";
import { getSignedUrls, uploadFile } from "@/lib/services";
import TextField, { TextArea } from "@/app/components/textfield";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import { useParams, useRouter } from "next/navigation";
import { useOrg } from "@/lib/contexts/org";
import useSWR from "swr";
import { fetcher } from "@/lib";

const Schema = object({
  name: RequiredSchema("Name is required"),
  description: RequiredSchema("Description is required"),
  type: string()
    .oneOf(["product", "service"])
    .required("Product type is required"),
  // imageFiles: array()
  //   .min(1, "Please add at least one image")
  //   .required("Please add at least one image"),
});

async function upload(file: File) {
  const [{ key, url }] = await getSignedUrls(1);

  await uploadFile(url, file);

  return key;
}

export default function UpdateProduct() {
  const { productId } = useParams();
  const { data, isLoading, error, mutate } = useSWR<Product>(
    `/organization/products/${productId}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const router = useRouter();
  const { org } = useOrg();

  const { setAlert } = useAlert();

  const initialValues = {
    name: data?.name,
    description: data?.description,
    type: data?.type,
  };

  const { formik } = usePost<Product, typeof initialValues>({
    url: `/organization/products/${productId}`,
    enableReinitialize: true,
    initialValues,
    schema: Schema,
    type: "patch",
    // modifyBefore: async (data) => {
    //   const keys = await Promise.all(data.imageFiles.map((f) => upload(f)));
    //   console.log("keys", keys);
    //   return {
    //     ...omit(data, ["imageFiles"]),
    //     imageKeys: keys,
    //   };
    // },
    onComplete: (data) => {
      mutate(data)
      router.push(`/dashboard/${org?.id}/products/details/${data.id}`);
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
    return <p>Failed to fetch product details</p>;
  }

  if (isLoading) {
    <LoadingIndicator />;
  }

  if (!data) {
    return <p>Failed to fetch product details</p>;
  }

  return (
    <FormikProvider value={formik}>
      <Form
        className="max-w-full w-full justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className=" justify-center items-start gap-14 p-4">
          {/* <div className="">
            <div className="w-20 h-20 bg-black rounded-full">
              <Image />
            </div>
          </div> */}
          <h3 className="text-2xl font-bold mb-4">Update Product</h3>
          <div className="flex flex-col w-fit min-w-[50%] gap-3">
            <TextField
              {...getFieldProps("name")}
              id="name"
              label="Name"
              {...getFieldProps("name")}
              error={touched.name && errors.name}
            />

            <TextArea
              label="Description"
              className="w-full"
              {...getFieldProps("description")}
              id="description"
              error={touched.description && errors.description}
            />

            <div>
              <p id="type-radio-group" className="font-medium block mb-1">
                Type
              </p>
              <div className="flex gap-4">
                <label htmlFor="product" className="flex gap-2">
                  <input
                    type="radio"
                    id="product"
                    value="product"
                    checked={formik.values.type === "product"}
                    onChange={getFieldProps("type").onChange}
                    name="type"
                  />
                  Product
                </label>
                <label htmlFor="service" className="flex gap-2">
                  <input
                    type="radio"
                    id="service"
                    value="service"
                    checked={formik.values.type === "service"}
                    onChange={getFieldProps("type").onChange}
                    name="type"
                  />
                  Service
                </label>
              </div>
            </div>
            {/* 
            <div className="flex flex-col">
              <label htmlFor="profileImage" className="font-medium">
                Images (5 max)
              </label>
              <input
                name="imageKeys"
                type="file"
                accept="image/png"
                multiple
                onChange={(e) => {
                  const { files } = e.target;

                  if (files && files?.length > 0) {
                    setFieldValue("imageFiles", Array.from(files));
                  }
                }}
                className={`border-2 rounded-lg p-4 ${
                  touched.imageFiles && errors.imageFiles
                    ? "border-red-500"
                    : ""
                } `}
                id="imageKeys"
              />
              {touched.imageFiles && (
                <span className="text-sm text-red-500 mt-0.5">
                  {errors.imageFiles}
                </span>
              )}
            </div> */}

            <Button className="mt-4" type="submit">
              {isSubmitting ? (
                <LoadingIndicator height={14} width={14} />
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
}
