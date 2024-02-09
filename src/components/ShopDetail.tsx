import React from "react";
import { Shop } from "@/types";

const ShopDetail = ({ shop }: { shop?: Shop }) => {
  const {
    shopTitle,
    description,
    categories,
    subCategories,
    openingHours,
    image,
    phoneNumber,
    metaDescription,
    pageTitle,
    mapId,
    socialLinks,
    services,
  } = shop || {};
  return (
    <>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <img
          src={image?.src}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {shopTitle}
      </h1>
      {description ? (
        <div
          className="italic text-gray-500"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : null}
      <hr />
      <h3>Metadata</h3>
      <p className="mt-2 font-medium text-gray-900">pageTitle: {pageTitle}</p>
      <p className="mt-2 font-medium text-gray-900">
        metaDescription: {metaDescription}
      </p>
      <hr />
      <p className="italic text-gray-500">
        Categories: {categories?.join(", ")}
      </p>
      <p className="mt-2 font-medium text-gray-900">
        Subcategories: {subCategories?.join(", ")}
      </p>
      <p className="mt-2 font-medium text-gray-900">
        Services: {services?.join(", ")}
      </p>
      <hr />
      <div className="mt-2 font-medium text-gray-900">
        Opening Hours
        <ul>
          {openingHours?.map((o, index) => (
            <li key={index}>
              {o.day}: from {o.open} to {o.close}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 font-medium text-gray-900">Contact: {phoneNumber}</p>
      <p className="mt-2 font-medium text-gray-900">MapId: {mapId}</p>
      <p className="mt-2 font-medium text-gray-900">X: {socialLinks?.x}</p>
      <p className="mt-2 font-medium text-gray-900">
        Facebook: {socialLinks?.facebook}
      </p>
    </>
  );
};

export default ShopDetail;
