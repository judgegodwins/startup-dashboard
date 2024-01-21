import axios, { AxiosError, AxiosResponse } from "axios";
import { APIResponse, SuccessDataResponse } from "@/lib/types/api";
import { ApiError, ValidationError } from "./errors";

export const axiosHttp = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const apiErrorParser = (e: Error | AxiosError<Response>) => {
  if (axios.isAxiosError(e) && e.response) {
    if (e.response.status === 422) {
      throw new ValidationError(e.response?.data.message, e.response.status, e.response.data.errors)
    }
    throw new ApiError(e.response?.data.message, e.response.status);
  } else {
    throw e;
  }
};

export const commonSuccessRespFilter = <RType extends APIResponse>(
  response: AxiosResponse<RType>
) => {
  if (response.data && response.data.status === "error")
    throw new ApiError(response.data.message, response.status);

  return response;
};

export function fetcher(url: string) {
  return axiosHttp
    .get(url)
    .then(commonSuccessRespFilter)
    .then((response) => response.data.data)
    .catch(apiErrorParser);
}

export function proxy(url: string) {
  return axios
    .get(url)
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}

export function paginationFetcher(url: string) {
  return axiosHttp
    .get(url)
    .then(commonSuccessRespFilter)
    .then((response) => response.data)
    .catch(apiErrorParser);
}
