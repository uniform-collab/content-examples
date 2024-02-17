import ShopSearch from "@/components/ShopSearch";
import { Shop } from "@/types";
import { getCategories, getShops } from "@/uniform/contentUtil";
import { GetStaticProps, InferGetStaticPropsType } from "next";

type ShopsRestaurantsPage = {
  shops: Shop[];
};

export default function ShopsRestaurants({
  shops,
  shopCategories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="mt-2 pb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shops & Restaurants
          </h1>
          <ShopSearch categories={shopCategories} />
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = (async ({ preview }) => {
  const shops = await getShops(200, Boolean(preview));

  const shopCategories: Record<string, string> = (
    await getCategories(100, Boolean(preview))
  ).reduce((obj, item) => Object.assign(obj, { [item.name]: item.id }), {});

  return { props: { shops, shopCategories } };
}) satisfies GetStaticProps<ShopsRestaurantsPage>;
