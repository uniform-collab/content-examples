// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { contentClient, entryToShop } from "@/uniform/contentUtil";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { cat, q, sort, limit, excludeids } = req.query || {};
  const searchQuery = q as string;
  const sortOrder = sort === "asc" ? "ASC" : "DESC";
  const limitNumber = limit ? Number.parseInt(limit as string) : 100;
  const excludes = excludeids ? (excludeids as string).split(",") : [];

  // TODO:
  // don't run search if it's less than 3 chars
  // if (searchQuery?.length < 2) {
  //   return res.status(200).json([]);
  // }

  // adding category filter, if provided
  const filters: any = {
    type: { eq: "shop" },
    ...(cat ? { "fields.category": { eq: cat } } : {}),
  };

  const searchResults = await contentClient
    .getEntries({
      search: searchQuery,
      filters,
      skipDataResolution: true,
      locale: "fr-FR",
      limit: limitNumber,
      orderBy: [`fields.shopTitle_${sortOrder}`],
    })
    .then((results) => {
      const shops = results.entries.map((e) => entryToShop(e));
      if (excludes) {
        return shops.filter((s) => !excludes.includes(s.id));
      }
      return shops;
    });

  res.status(200).json(searchResults);
}
