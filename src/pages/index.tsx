import ShopTile from "@/components/Tile";
import ShopSearch from "@/components/ShopSearch";
import { Shop } from "@/types";
import {
  getCategories,
  getShops,
  getSubCategories,
} from "@/uniform/contentUtil";
import { Category } from "@uniformdev/canvas";
import { GetStaticProps, InferGetStaticPropsType } from "next";

type ShopsRestaurantsPage = {
  shops: Shop[];
};

export default function ShopsRestaurants({
  shops,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="mt-2 pb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shops & Restaurants
          </h1>
          <ShopSearch />
          {/* <div className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {shops?.map((shop: Shop, index: number) => (
                <ShopTile key={index} {...shop} />
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = (async ({ preview }) => {
  const shops = await getShops(300, Boolean(preview));

  return { props: { shops } };
}) satisfies GetStaticProps<ShopsRestaurantsPage>;
