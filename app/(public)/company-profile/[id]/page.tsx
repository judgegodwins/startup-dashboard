"use client";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import ProductComponent from "@/app/components/product";
import { Organization, Product } from "@/lib/types/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

function Attribute(props: { label: string; value: string }) {
  return (
    <div className="first:mt-0 mt-4">
      <p className="text-textSecondary font-medium">{props.label}</p>
      <p>{props.value}</p>
    </div>
  );
}

export default function CompanyProfile() {
  const { id } = useParams();

  const { data, error, isLoading } = useSWR<Organization>(() =>
    id ? `/organization/public/${id}` : null
  );

  const {
    data: prodData,
    error: prodError,
    isLoading: prodLoading,
  } = useSWR<Product[]>(() => (id ? `/organization/${id}/products` : null));

  const [tab, setTab] = useState(0);

  if (error) {
    console.log(error);
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>
          {error.statusCode &&
          (error.statusCode === 422 || error.statusCode === 404)
            ? "Organization not found"
            : "An error occurred"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Organization not found</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <div className="flex w-full pb-6">
        <div className="flex gap-7 items-center">
          <div>
            <Image
              priority
              src={data.logo || "/images/default_company.png"}
              alt="company logo"
              height={135}
              width={135}
              className="rounded-xl w-[135px] h-[135px]"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <p className="text-textSecondary mt-2">ORGANIZATION</p>
              <h1 className="text-3xl font-semibold text-t">{data.name}</h1>
            </div>

            <div className="flex">
              <div
                onClick={() => setTab(0)}
                className="p-2 transition-all cursor-pointer hover:bg-[rgba(0,0,0,.07)]"
              >
                <span>Details</span>
                <div
                  className={`transition-all h-1 bg-black w-4 ${
                    tab === 0 ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
              </div>
              <div
                onClick={() => {
                  setTab(1);
                }}
                className="p-2 transition-all hover:bg-[rgba(0,0,0,.07)] cursor-pointer"
              >
                <span>Products & Services</span>
                <div
                  className={`transition-all h-1 bg-black w-4 ${
                    tab === 1 ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-8">
        {tab === 0 && (
          <>
            <div>
              <div className="border-b">
                <h2 className="text-xl font-medium mb-2">Description</h2>
              </div>
              <p className="mt-2">{data.description}</p>
            </div>
            <div className="mt-12">
              <div className="border-b">
                <h2 className="text-xl font-medium mb-2">Details</h2>
              </div>
              <div className="flex mt-4 gap-16">
                <div>
                  <div>
                    <p className="text-textSecondary font-medium">
                      Founded Date
                    </p>
                    <p>{new Date(data.yearFounded).toDateString()}</p>
                  </div>

                  <div className="first:mt-0 mt-4">
                    <p className="text-textSecondary font-medium">
                      Company Type
                    </p>
                    <p>For Profit</p>
                  </div>

                  {data.industry && (
                    <div className="first:mt-0 mt-4">
                      <p className="text-textSecondary font-medium">Industry</p>
                      <p>{data.industry}</p>
                    </div>
                  )}
                </div>

                <div>
                  {data.email && (
                    <div>
                      <p className="text-textSecondary font-medium">
                        Contact Emaiil
                      </p>
                      <p>{data.email}</p>
                    </div>
                  )}

                  {data.phoneNumber && (
                    <div className="first:mt-0 mt-4">
                      <p className="text-textSecondary font-medium">
                        Phone Number
                      </p>
                      <p>{data.phoneNumber}</p>
                    </div>
                  )}

                  <div className="first:mt-0 mt-4">
                    <p className="text-textSecondary font-medium">
                      Operating Status
                    </p>
                    <p>Active</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {tab === 1 && (
          <div className="w-full flex flex-wrap gap-10">
            {prodError && <p>Could not fetch products</p>}
            {prodLoading && <LoadingIndicator />}
            {prodData && prodData.length === 0 && (
              <p>This organization has no products yet</p>
            )}
            {prodData &&
              prodData.map((p) => <ProductComponent key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
