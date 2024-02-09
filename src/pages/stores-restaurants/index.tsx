import { getEntriesByType, getShops } from "@/uniform/contentUtil";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

export type Shop = {
  shopTitle: string;
  description: string;
  slug: string;
  categories: string[];
  subcategories: string[];
  openingHours: string[];
};

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
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shops & Restaurants
          </h1>
          <div className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {shops?.map((shop: Shop, index: number) => (
                <ShopTile key={index} {...shop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShopTile = ({
  shopTitle,
  description,
  slug,
  categories,
  subcategories,
  openingHours,
}: Shop) => {
  return (
    <Link href={`/stores-restaurants/${slug}`} className="group text-sm">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <img
          src="https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{shopTitle}</h3>
      {/* <div
        className="italic text-gray-500"
        dangerouslySetInnerHTML={{ __html: description }}
      ></div> */}
      <p className="italic text-gray-500">
        Categories: {categories?.join(", ")}
      </p>
      <p className="mt-2 font-medium text-gray-900">
        Subcategories: {subcategories?.join(", ")}
      </p>
      <p className="mt-2 font-medium text-gray-900">
        Opening Hours: {openingHours?.join(", ")}
      </p>
    </Link>
  );
};
export const getStaticProps = (async ({ preview }) => {
  const shops = await getShops(100, preview === true);
  console.log({ shops });
  return { props: { shops } };
}) satisfies GetStaticProps<{
  repo: ShopsRestaurantsPage;
}>;
