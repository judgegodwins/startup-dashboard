import axios from "axios";
import { apiErrorParser, axiosHttp, commonSuccessRespFilter } from "..";
import { SignedUrl, SuccessDataResponse } from "../types/api";

export function saveToken(data: { token: string; expires: string }) {
  return axios
    .post("/api/token", data)
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}

export function deleteToken() {
  return axios
    .delete("/api/token")
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}

export function verifyEmail(data: { email: string; token: string }) {
  return axiosHttp
    .post("/auth/email/verify", data)
    .then(commonSuccessRespFilter)
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}

export function getSignedUrls(sign: number) {
  return axiosHttp
    .get<SuccessDataResponse<SignedUrl[]>>("/files/signed-url", {
      params: { sign },
    })
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}

export function uploadFile(url: string, file: File) {
  return axios.put(url, file).catch(apiErrorParser);
}

export function createPost(data: { caption: string; images: string[] }) {
  console.log("creating post");
  return axiosHttp
    .post("/posts", data)
    .then((r) => r.data.data)
    .catch(apiErrorParser);
}
