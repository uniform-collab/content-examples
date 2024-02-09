import { Shop } from "@/pages/stores-restaurants";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  ContentClient,
  Entry,
  GetEntriesResponse,
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
  limit: number,
  preview: boolean
): Promise<Shop[]> {
  const shopEntries = await getEntriesByType("shop", limit, preview);
  return shopEntries?.map((e) => {
    return {
      shopTitle: e.entry?.fields?.shopTitle?.value,
      slug: e.entry?._slug,
      description: renderToHtml(e.entry?.fields?.description?.value?.root),
      categories:
        e.entry?.fields?.category?.value?.map(
          (c: any) => c.fields.itemName.value
        ) ?? [],
      openingHours:
        e.entry?.fields?.openingHours?.value?.map(
          (c: any) => `${c.fields.displayName?.value} : ${c.fields.openingTime?.value} - ${c.fields.closingTime?.value}`
        ) ?? [],
      subCategories:
        e.entry?.fields?.subCategory?.value?.map(
          (c: any) => c.fields.itemName.value
        ) ?? [],
    };
  });
}

export async function getShopBySlug(
  preview: boolean,
  slug: string
): Promise<Entry> {
  const response: GetEntriesResponse = await contentClient.getEntries({
    type: ["shop"],
    slug: slug,
    state: getState(preview),
    limit: 1,
  });
  return response.entries?.[0];
}
