import { Shop } from "@/types";
import React, { useEffect, useState } from "react";
import ShopTile from "./Tile";

const SimilarShops = ({
  currentShopId,
  categoryId,
  limit = 5,
}: {
  currentShopId: string;
  categoryId: string;
  limit?: number;
}) => {
  const [matchingShops, setMatchingShops] = React.useState([]);
  useEffect(() => {
    async function runSearch() {
      const response = await fetch(
        `/api/search?cat=${categoryId}&sort=asc&limit=${limit}&excludeids=${currentShopId}`
      );
      const results = await response.json();
      setMatchingShops(results);
    }
    runSearch();
  }, [categoryId]);

  return (
    <>
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-6 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {matchingShops?.map((shop: Shop, index: number) => (
            <ShopTile key={index} {...shop} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SimilarShops;
