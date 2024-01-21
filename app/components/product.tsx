import { Product } from "@/lib/types/api";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";

export default function ProductComponent(props: { product: Product }) {
  return (
    <div className="border p-4 rounded-xl w-1/5 basis-1/5 grow-0">
      <div className="relative w-full h-52">
        <Image
          priority
          layout="fill"
          src={props.product.imageKeys[0]}
          alt="product image"
          className="rounded-xl object-cover"
        />
      </div>
      <p className="text-lg font-medium my-3">{props.product.name}</p>
      <div className="h-16 mb-4 w-full">
        <p className="block text-textSecondary h-full text-sm w-full overflow-hidden text-ellipsis">
          {props.product.description}
        </p>
      </div>
      <Link href={`/product/${props.product.id}`}>
        <Button className="font-bold !bg-[rgba(0,0,0,.03)] !text-black hover:bg-hover">
          Read More
        </Button>
      </Link>
    </div>
  );
}
