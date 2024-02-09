import { OpeningHour, Shop } from "@/types";
import {
  AssetParamValue,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  ContentClient,
  Entry,
  GetEntriesResponse,
  LinkParamValue,
  RichTextParamValue,
} from "@uniformdev/canvas";
import { renderToHtml } from "@uniformdev/richtext";

export const contentClient = new ContentClient({
  apiKey: process.env.UNIFORM_API_KEY,
  projectId: process.env.UNIFORM_PROJECT_ID,
});

export const getState = (preview: boolean | undefined) =>
  process.env.NODE_ENV === "development" || preview
    ? CANVAS_DRAFT_STATE
    : // TODO: replace with CANVAS_PUBLISHED_STATE after content is published
      CANVAS_DRAFT_STATE;

export async function getEntriesByType(
  typeId: string,
  limit: number,
  preview: boolean
): Promise<Entry[]> {
  let result: Entry[] = [];
  let fetched = limit > 20 ? 20 : limit;
  let offset = 0;
  let latestResponseLength = -1;
  while (latestResponseLength === -1 || latestResponseLength >= 20) {
    const response: GetEntriesResponse = await contentClient.getEntries({
      type: [typeId],
      state: getState(preview),
      limit: 20,
      offset,
    });
    latestResponseLength = response.entries.length;
    result = result.concat(response.entries);
    offset += result.length;
    fetched += result.length;
  }

  return result;
}

export async function getShops(
  limit: number = 300,
  preview: boolean = false
): Promise<Shop[]> {
  const shopEntries = await getEntriesByType("shop", limit, preview);
  return shopEntries?.map((e) => entryToShop(e)!);
}

export async function getShopSlugs(
  limit: number = 300,
  preview: boolean = false
): Promise<string[]> {
  return (await getEntriesByType("shop", limit, preview))?.map(
    (e) => e.entry._slug!
  );
}

export async function getShopBySlug(
  slug: string,
  preview: boolean = false
): Promise<Shop | undefined> {
  const response: GetEntriesResponse = await contentClient.getEntries({
    type: ["shop"],
    slug: slug,
    state: getState(preview),
    limit: 1,
  });
  return entryToShop(response.entries?.[0]);
}

const entryToShop = (e: Entry): Shop | undefined => {
  if (!e) {
    return undefined;
  }

  const shop: Shop = {
    shopTitle: e.entry?.fields?.shopTitle?.value as string,
    slug: e.entry?._slug as string,
    description: renderToHtml(
      (e.entry?.fields?.description?.value as RichTextParamValue)?.root
    ),
    thumbnailImage: {
      src: e.entry?.fields?.mobileImage?.value
        ? (e.entry?.fields?.mobileImage?.value as AssetParamValue)[0].fields
            ?.url?.value
        : // TODO: remove this fallback after images are sorted
          "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
    },
    // TODO
    logoImage: {
      src: "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
    },
    image: {
      src: e.entry?.fields?.largeImage?.value
        ? (e.entry?.fields?.largeImage?.value as AssetParamValue)[0].fields?.url
            ?.value
        : // TODO: remove this fallback after images are sorted
          "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
    },
    categories:
      (
        e.entry?.fields?.category?.value as Array<{
          fields: { itemName: string };
        }>
      )?.map((c: any) => c.fields.itemName.value) ?? ([] as string[]),
    services:
      (
        e.entry?.fields?.services?.value as Array<{
          fields: { itemName: string };
        }>
      )?.map((c: any) => c.fields?.itemName?.value) ?? [],
    openingHours: (
      e.entry?.fields?.openingHours?.value as Array<{
        fields: {
          displayName: string;
          openingTime: string;
          closingTime: string;
        };
      }>
    )?.map((c: any) => {
      return {
        day: c.fields.displayName?.value,
        open: c.fields.openingTime?.value,
        close: c.fields.closingTime?.value,
      };
    }) as OpeningHour[],
    subCategories:
      (
        e.entry?.fields?.subCategory?.value as Array<{
          fields: { itemName: string };
        }>
      )?.map((c: any) => c.fields.itemName.value) ?? ([] as string[]),
    phoneNumber: e.entry?.fields?.contact?.value as string,
    metaDescription: e.entry?.fields?.metaDescription?.value as string,
    pageTitle: e.entry?.fields?.pageTitle?.value as string,
    mapId: e.entry?.fields?.placeId?.value as string,
    socialLinks: {
      x: (e.entry?.fields?.twitterUrl?.value as LinkParamValue)?.path ?? "",
      facebook:
        (e.entry?.fields?.facebookUrl?.value as LinkParamValue)?.path ?? "",
    },
  };
  return shop;
};
