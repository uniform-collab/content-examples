// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { contentClient, entryToShop } from "@/uniform/contentUtil";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { cat, q } = req.query || {};
  const searchQuery = q as string;

  // don't run search if it's less than 3 chars
  // if (searchQuery?.length < 2) {
  //   return res.status(200).json([]);
  // }

  // adding category filter, if provided
  let filters = {};
  if (cat) {
    filters = {
      "fields.category": { eq: cat },
    };
  }

  const searchResults = await contentClient
    .getEntries({
      type: ["shop"],
      search: searchQuery,
      filters,
      skipDataResolution: true,
      locale: "fr-FR",
      limit: 100,
    })
    .then((results) => {
      console.log(results.entries);
      return results.entries.map((e) => entryToShop(e));
    });

  res.status(200).json(searchResults);
}
