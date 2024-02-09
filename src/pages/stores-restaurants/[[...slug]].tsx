import ShopDetail from "@/components/ShopDetail";
import { Shop } from "@/types";
import { getShopBySlug, getShopSlugs } from "@/uniform/contentUtil";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

type ShopDetailPageProps = {
  shop?: Shop;
};

export default function ShopDetailPage({
  shop,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <ShopDetail shop={shop} />
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = (async ({ params, preview }) => {
  const { slug } = params || {};
  const shop = await getShopBySlug(slug as string, preview === true);
  return { props: { shop } };
}) satisfies GetStaticProps<ShopDetailPageProps>;

export const getStaticPaths = (async () => {
  const paths = (await getShopSlugs()).map((s) => `/stores-restaurants/${s}`);
  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;
