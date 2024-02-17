import React from "react";
import { Shop } from "@/types";
import SimilarShops from "./SimilarShops";

const ShopDetail = ({ shop }: { shop?: Shop }) => {
  const {
    id,
    shopTitle,
    description,
    category,
    categoryId,
    subCategory,
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
      {category ? (
        <p className="italic text-gray-500">Category: {category}</p>
      ) : null}
      <p className="mt-2 font-medium text-gray-900">
        Subcategory: {subCategory}
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
      <h2 className="text-primary text-3xl">Similar shops</h2>
      {category ? (
        <SimilarShops categoryId={categoryId!} currentShopId={id!} limit={5} />
      ) : null}
    </>
  );
};

export default ShopDetail;
