"use client";
import Button from "@/app/components/button";
import LoadingIndicator from "@/app/components/loading-indicator";
import { useOrg } from "@/lib/contexts/org";
import { Product } from "@/lib/types/api";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default function Products() {
  const { org } = useOrg();
  const { data, isLoading, error } = useSWR<Product[]>(
    "/organization/products"
  );

  if (!org) return <LoadingIndicator />;

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {error && <p>Could not fetch products</p>}
      {isLoading && <LoadingIndicator />}
      {!error && !isLoading && data && (
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <h3 className="text-xl font-medium">All Products & Services</h3>
            <Link href={`/dashboard/${org.id}/products/new`}>
              <Button>New Product</Button>
            </Link>
          </div>
          <div className="mt-8">
            <table className="w-full table-auto border-separate border-spacing-x-2">
              <thead>
                <tr className="">
                  <th className="text-left p-4 font-medium leading-3 text-textSecondary bg-[#f4f4f4] rounded-xl">
                    name
                  </th>
                  <th className="text-left p-4 font-medium leading-3 text-textSecondary bg-[#f4f4f4] rounded-xl">
                    type
                  </th>
                  <th className="text-left p-4 font-medium leading-3 text-textSecondary bg-[#f4f4f4] rounded-xl">
                    created
                  </th>
                  <th className="text-left p-4 font-medium leading-3 text-textSecondary bg-[#f4f4f4] rounded-xl">
                    last modified
                  </th>
                  <th className="text-left p-4 font-medium leading-3 text-textSecondary bg-[#f4f4f4] rounded-xl">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id} className="">
                    <td className="relative py-6 px-4 border-solid before:-z-10 before:left-0 before:top-0 before:absolute before:border-b before:w-[calc(100%+4px)] last:before:w-full before:h-full">
                      <div className="flex gap-8 items-center">
                        <Image
                          src={p.imageKeys[0]}
                          height={50}
                          width={50}
                          className="object-cover w-[50px] h-[50px] rounded"
                          alt="product image"
                        />
                        <Link href={`/dashboard/${org.id}/products/details/${p.id}`}>{p.name}</Link>
                      </div>
                    </td>
                    <td className="relative py-6 px-4 border-solid before:z-10 before:left-0 before:top-0 before:absolute before:border-b before:w-[calc(100%+4px)] last:before:w-full before:h-full">
                      {p.type}
                    </td>
                    <td className="relative py-6 px-4 border-solid before:z-10 before:left-0 before:top-0 before:absolute before:border-b before:w-[calc(100%+4px)] last:before:w-full before:h-full">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="relative py-6 px-4 border-solid before:z-10 before:left-0 before:top-0 before:absolute before:border-b before:w-[calc(100%+4px)] last:before:w-full before:h-full">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="relative py-6 px-4 border-solid before:z-10 before:left-0 before:top-0 before:absolute before:border-b before:w-[calc(100%+4px)] last:before:w-full before:h-full">
                      <div>
                        <p onClick={() => {}} className="cursor-pointer underline">Delete</p>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* <tr>
              <td>Logos Presensaation.mp4</td>
              <td>no tag</td>
              <td>company kit</td>
              <td>24.02.2022</td>
            </tr>
            <tr>
              <td>Logos Presensaation.mp4</td>
              <td>no tag</td>
              <td>company kit</td>
              <td>24.02.2022</td>
            </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
