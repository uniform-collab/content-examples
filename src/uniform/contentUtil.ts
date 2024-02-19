import { Category, OpeningHour, Shop } from "@/types";
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
    offset += 20;
  }
  // console.log({ typeId, total: result.length });
  return result;
}

export async function getCategoryMap(preview: Boolean) {
  const categories = await getCategories(100, Boolean(preview));
  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { slug: cat.slug, name: cat.name });
  });
  return categoryMap;
}

export async function getSubcategoryMap(preview: Boolean) {
  const subCategories = await getSubCategories(100, Boolean(preview));
  const subCategoryMap = new Map();
  subCategories.forEach((cat) => {
    subCategoryMap.set(cat.id, { slug: cat.slug, name: cat.name });
  });
  return subCategoryMap;
}

export async function getShops(
  limit: number = 300,
  preview: boolean = false
): Promise<Shop[]> {
  const categories = await getCategoryMap(preview);
  const subCategories = await getSubcategoryMap(preview);
  const entries = await getEntriesByType("shop", limit, preview);
  return entries?.map((e) => entryToShop(e, categories, subCategories));
}

export async function getCategories(
  limit: number = 300,
  preview: boolean = false
): Promise<Category[]> {
  const entries = await getEntriesByType("category", limit, preview);
  return entries?.map((e) => entryToCategory(e)!);
}

export async function getSubCategories(
  limit: number = 300,
  preview: boolean = false
): Promise<Category[]> {
  const entries = await getEntriesByType("subCategory", limit, preview);
  return entries?.map((e) => entryToCategory(e)!);
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
  const categories = await getCategories(100, Boolean(preview));
  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { slug: cat.slug, name: cat.name });
  });

  const subCategories = await getSubCategories(100, Boolean(preview));
  const subCategoryMap = new Map();
  subCategories.forEach((cat) => {
    subCategoryMap.set(cat.id, { slug: cat.slug, name: cat.name });
  });

  const response: GetEntriesResponse = await contentClient.getEntries({
    type: ["shop"],
    slug: slug,
    state: getState(preview),
    limit: 1,
  });
  return entryToShop(response.entries?.[0], categoryMap, subCategoryMap);
}

export const entryToShop = (
  e: Entry,
  categoryMap:
    | Map<string, { name: string; slug: string }>
    | undefined = undefined,
  subCategoryMap:
    | Map<string, { name: string; slug: string }>
    | undefined = undefined
): Shop => {
  let shop: Shop = { id: "" };
  if (!e) {
    return shop;
  }

  const categoryId = e.entry?.fields?.category?.value as string;
  const categoryName = categoryMap?.get(categoryId)?.name;
  const subCategoryName = subCategoryMap?.get(
    e.entry?.fields?.subCategory?.value as string
  )?.name;

  shop = {
    id: e.entry._id,
    shopTitle: e.entry?.fields?.shopTitle?.value as string,
    slug: e.entry?._slug as string,
    description: renderToHtml(
      (e.entry?.fields?.description?.value as RichTextParamValue)?.root
    ),
    thumbnailImage: {
      src: e.entry?.fields?.mobileImage?.value
        ? (e.entry?.fields?.mobileImage?.value as AssetParamValue)[0]?.fields
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
        ? (e.entry?.fields?.largeImage?.value as AssetParamValue)[0]?.fields?.url
            ?.value
        : // TODO: remove this fallback after images are sorted
          "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
    },
    category: categoryName ?? "",
    categoryId: (e.entry?.fields?.category?.value as string) ?? "",
    subCategory: subCategoryName ?? "",
    serviceId: (e.entry?.fields?.services?.value as string) ?? "",
    openingHours:
      ((
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
      }) as OpeningHour[]) ?? [],
    phoneNumber: (e.entry?.fields?.contact?.value as string) ?? "",
    metaDescription: (e.entry?.fields?.metaDescription?.value as string) ?? "",
    pageTitle: (e.entry?.fields?.pageTitle?.value as string) ?? "",
    mapId: e.entry?.fields?.placeId?.value as string,
    socialLinks: {
      x: (e.entry?.fields?.twitterUrl?.value as LinkParamValue)?.path ?? "",
      facebook:
        (e.entry?.fields?.facebookUrl?.value as LinkParamValue)?.path ?? "",
    },
  };

  return shop;
};

const entryToCategory = (e: Entry): Category | undefined => {
  if (!e) {
    return undefined;
  }

  const category: Category = {
    id: e.entry._id,
    name:
      (e.entry?.fields?.category?.value as string) ??
      (e.entry?.fields?.subCategoryName?.value as string),
    slug: e.entry?._slug as string,
  };

  return category;
};
