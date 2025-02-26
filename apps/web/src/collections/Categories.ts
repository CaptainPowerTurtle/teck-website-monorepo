import type { CollectionConfig } from "payload";

import { anyone } from "@/libs/auth/access/anyone";
import { authenticated } from "@/libs/auth/access/authenticated";
import { slugField } from "@/libs/fields/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField(),
  ],
};
