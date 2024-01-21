import { useState } from "react";
import { FormikValues, useFormik } from "formik";
import { SuccessDataResponse } from "@/lib/types/api";
import { AnySchema } from "yup";
import { axiosHttp, apiErrorParser, commonSuccessRespFilter } from "@/lib/";

interface UsePostProps<
  TReturnType,
  TData extends FormikValues,
  T extends AnySchema
> {
  url: string;
  initialValues: TData;
  modifyBefore?: (data: TData) => any | Promise<any>;
  schema?: T;
  type?: "post" | "patch";
  notify?: boolean;
  enableReinitialize?: boolean;
  onComplete?: (data: TReturnType) => any;
  onError?: (e: Error) => void;
}

export function usePost<
  TReturnType,
  TData extends FormikValues = FormikValues,
  TShape extends AnySchema = AnySchema
>(options: UsePostProps<TReturnType, TData, TShape>) {
  const [error, setError] = useState<string>();
  const [data, setData] = useState<TReturnType>();
  const [message, setMessage] = useState<string>();

  // const { notify } = useProvideNotification();

  const formik = useFormik<TData>({
    initialValues: options.initialValues,
    enableReinitialize: options.enableReinitialize,
    validationSchema: options.schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const body = options.modifyBefore
          ? await options.modifyBefore(values)
          : values;

        axiosHttp[options.type || "post"]<SuccessDataResponse<TReturnType>>(
          options.url,
          body
        )
          .then(commonSuccessRespFilter)
          .then(({ data: resData }) => {
            setData(resData.data);
            setMessage(resData.message);
            setSubmitting(false);
            resetForm();
            if (options.onComplete) options.onComplete(resData.data);
            // if (options.notify) notify(resData.message);
          })
          .catch(apiErrorParser)
          .catch((e: Error) => {
            setError(e.message);
            // notify(e);
            setSubmitting(false);
            if (options.onError) options.onError(e);
          });
      } catch (e) {
        if (options.onError) options.onError(e as any);
      }
    },
  });

  return {
    message,
    data,
    error,
    formik,
  };
}
