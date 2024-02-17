// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { contentClient, entryToShop } from "@/uniform/contentUtil";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { q } = req.query || {};
  const searchResults = await contentClient
    .getEntries({
      type: ["shop"],
      search: q as string,
      filters: {
        // "fields.shopTitle": { match: q as string },
        // type: "shop",
        // filters: {
        //   "fields.shopTitle": { match: "American Vintage" },
        // },
      },
      skipDataResolution: true,
      locale: "fr-FR",
      limit: 1,
    })
    .then((results) => {
      console.log(results.entries);
      return results.entries.map((e) => entryToShop(e));
    });

  res.status(200).json(searchResults);
}
