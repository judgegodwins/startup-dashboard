import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import cookie from "cookie";
import axios from "axios";
import { SuccessDataResponse, User } from "@/lib/types/api";
import { axiosHttp } from "@/lib";

export async function POST(request: NextRequest) {
  const { token, expires } = await request.json();

  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(expires),
        sameSite: "strict",
        path: "/",
      }),
    },
  });
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return Response.json({ status: "error" }, { status: 401 });
  }

  // cookieStore.delete("token");

  try {
    const res = await axiosHttp.get<SuccessDataResponse<User>>("/auth/user", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return Response.json(
      {
        ...res.data,
        data: {
          user: res.data.data,
          token: token.value,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    if ((err as any).response) {
      console.log("error", err);
      return Response.json(
        { status: "error" },
        { status: (err as any).response.status }
      );
    }

    return Response.json({ status: "error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("token");

  return Response.json({
    status: "error",
  });
}
