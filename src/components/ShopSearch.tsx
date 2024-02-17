import { Shop } from "@/types";
import React, { useEffect, useState } from "react";
import ShopTile from "./Tile";

const ShopSearch = ({ categories }: { categories: Record<string, string> }) => {
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const onChangeHandler = async (event: any) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    async function runSearch() {
      const response = await fetch(
        `/api/search?q=${searchTerm}&cat=${selectedCategory}`
      );
      const results = await response.json();
      setSearchResults(results);
    }
    runSearch();
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <select
            id="categoryFilter"
            name="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            <option value="">All</option>
            {Object.keys(categories)?.map((c, i: number) => (
              <option key={i} value={categories[c] as string}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <input
          type="search"
          id="search-dropdown"
          className="block w-full rounded-md border-0 py-1.5 pl-64 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search shops"
          onChange={onChangeHandler}
          value={searchTerm}
          required
        />
      </div>
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-64 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {searchResults?.map((shop: Shop, index: number) => (
            <ShopTile key={index} {...shop} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShopSearch;
