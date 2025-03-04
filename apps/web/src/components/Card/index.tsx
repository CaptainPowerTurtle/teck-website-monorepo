"use client";
import { cn } from "@repo/utils";
import useClickableCard from "@/libs/utils/useClickableCard";
import Link from "next/link";
import React, { Fragment } from "react";

import type { Article } from "@/payload-types";

import { Media } from "@/components/Media";
import { badgeVariants } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";

export type CardArticleData = Pick<
  Article,
  "slug" | "categories" | "meta" | "title"
>;

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CardArticleData;
  relationTo?: "articles";
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props;

  const { slug, categories, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  return (
    <article
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer group/card",
        className
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media resource={metaImage} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className="mt-2">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
      <hr />
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm">
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === "object") {
                    const { title: titleFromCategory } = category;

                    const categoryTitle =
                      titleFromCategory || "Untitled category";

                    const isLast = index === categories.length - 1;

                    return (
                      <Link
                        key={index}
                        className={cn(
                          badgeVariants({ variant: "default" }),
                          "dark:bg-zinc-700 dark:hover:bg-zinc-700/80 bg-gray-500 hover:bg-gray-500/80 text-1xl px-2 py-1 rounded-2xl"
                        )}
                        href={""}
                      >
                        {categoryTitle}
                      </Link>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
