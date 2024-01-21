export interface APIResponse {
  status: "error" | "success";
  message: string;
}

export interface SuccessDataResponse<Data> extends APIResponse {
  data: Data;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  yearFounded: string;
  users: User[];
  logo: string | null;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  email?: string;
  industry?: string;
  type:? OrganizationType;
}

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  imageKeys: string[];
  type: "product" | "service";
  organizationId: string;
}

export interface SignedUrl {
  key: string;
  url: string;
}

export interface Post {
  id: string;
  caption: string;
  images: string[];
  user_id: string;
  created_at: string;
}

export type LoginResponse = {
  user: User;
  token: string;
  tokenExpiresOn: string;
};
