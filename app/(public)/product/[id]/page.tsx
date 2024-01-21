"use client";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import { Product } from "@/lib/types/api";
import { capitalCase } from "change-case";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function PublicProductDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useSWR<Product>(
    () => id ?
    `/organization/products/${id}` : null
  );

  const [imageIndex, setImageIndex] = useState(0);

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
    <div className="w-full mt-8">
      <div className="w-full flex justify-between items-center pb-6 mb-6 border-b">
        <h2 className="text-2xl font-semibold">{data.name}</h2>
      </div>
      <div className="w-full flex h-screen">
        <div className="relative basis-1/2 h-[500px]">
          {data.imageKeys.length > 1 && imageIndex > 0 && (
            <div
              onClick={() => {
                if (imageIndex > 0) {
                  setImageIndex((prev) => prev - 1);
                }
              }}
              className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-2 z-10 w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.7)] shadow-sxl"
            >
              <Image
                priority
                width={32}
                height={32}
                alt="left arrow"
                src="/images/left-arrow.svg"
              />
            </div>
          )}
          {data.imageKeys.length > 1 &&
            imageIndex < data.imageKeys.length - 1 && (
              <div
                onClick={() => {
                  if (imageIndex < data.imageKeys.length - 1) {
                    setImageIndex((prev) => prev + 1);
                  }
                }}
                className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 z-10 w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.7)] shadow-sxl"
              >
                <Image
                  priority
                  width={32}
                  height={32}
                  alt="right arrow"
                  src="/images/right-arrow.svg"
                />
              </div>
            )}
          <Image
            priority
            layout="fill"
            alt="product image"
            className="object-cover rounded-lg"
            src={data.imageKeys[imageIndex]}
          />
        </div>
        <div className="pl-8 basis-1/2 grow">
          <div>
            <p className="font-medium">Name</p>
            <p className="text-textSecondary">{data.name}</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">Description</p>
            <p className="text-textSecondary overflow-hidden break-words">{data.description}</p>
          </div>

          <div className="mt-4">
            <p className="font-medium">Type</p>
            <p className="text-textSecondary">{capitalCase(data.type)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
