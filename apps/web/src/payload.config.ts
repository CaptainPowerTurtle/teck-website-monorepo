// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Articles } from "./collections/Articles";
import { Categories } from "./collections/Categories";
import { Header } from "./components/Header/config";
import { Footer } from "./components/Footer/config";

import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { searchPlugin } from "@payloadcms/plugin-search";
import { s3Storage } from "@payloadcms/storage-s3";

import { revalidateRedirects } from "@/libs/hooks/revalidateRedirects";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { searchFields } from "@/libs/search/fieldOverrides";
import { beforeSyncWithSearch } from "@/libs/search/beforeSync";
import { getServerSideURL } from "@/libs/utils/getURL";

import type { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import type { Page, Article } from "@/payload-types";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const generateTitle: GenerateTitle<Article | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Teck` : "Teck";
};

const generateURL: GenerateURL<Article | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export default buildConfig({
  globals: [Header, Footer],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [Pages, Articles, Media, Categories, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // database-adapter-config-start
  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    redirectsPlugin({
      collections: ["pages", "articles"],
      overrides: {
        // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ("name" in field && field.name === "from") {
              return {
                ...field,
                admin: {
                  description:
                    "You will need to rebuild the website when changing this field.",
                },
              };
            }
            return field;
          });
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ["categories"],
      generateURL: (docs) =>
        docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ("name" in field && field.name === "confirmationMessage") {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({
                        enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                      }),
                    ];
                  },
                }),
              };
            }
            return field;
          });
        },
      },
    }),
    searchPlugin({
      collections: ["articles"],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields];
        },
      },
    }),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        endpoint: process.env.S3_ENDPOINT || "",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION,
        // ... Other S3 configuration
      },
    }),
    // storage-adapter-placeholder
  ],
});
