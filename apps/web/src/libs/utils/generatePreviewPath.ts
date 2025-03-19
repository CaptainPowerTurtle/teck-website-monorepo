import type { PayloadRequest, CollectionSlug } from "payload";
import { env } from "@/env";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  articles: "/articles",
  pages: "",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug }: Props) => {
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: env.PREVIEW_SECRET || "",
  });

  const url = `/next/preview?${encodedParams.toString()}`;

  return url;
};
