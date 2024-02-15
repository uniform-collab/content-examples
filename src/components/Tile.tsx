import React from "react";
import { Shop } from "@/types";
import Link from "next/link";

const ShopTile = ({
  shopTitle,
  slug,
  category,
  subCategory,
  thumbnailImage,
  phoneNumber,
  services,
}: Shop) => {
  return (
    <Link href={`/stores-restaurants/${slug}`} className="group text-sm">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <img
          src={thumbnailImage?.src}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <h3 className="mt-4 font-medium text-gray-900 text-2xl">{shopTitle}</h3>
      <p className="italic text-gray-500 text-xl">Category: {category}</p>
      {subCategory ? (
        <p className="mt-2 font-medium text-gray-900 text-xl">
          Subcategory: {subCategory}
        </p>
      ) : null}
      <p className="mt-2 font-medium text-gray-900">Contact: {phoneNumber}</p>
      {services?.length > 0 ? (
        <p className="mt-2 font-medium text-gray-900">
          Services: {services.join(",")}
        </p>
      ) : null}
    </Link>
  );
};

export default ShopTile;
