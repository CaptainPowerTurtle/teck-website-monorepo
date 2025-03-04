"use client";
import { cn } from "@repo/utils";
import Image from "next/image";

import type { Article } from "@/payload-types";

import { Media } from "@/components/Media";
import { Fragment } from "react";
import useClickableCard from "@/libs/utils/useClickableCard";
import Link from "next/link";
import { formatAuthors } from "@/libs/utils/formatAuthors";
import { Badge, badgeVariants } from "@repo/ui/components/ui/badge";

export type CardArticleData = Pick<
  Article,
  "slug" | "categories" | "meta" | "title" | "populatedAuthors" | "authors"
>;

export const ContentCard: React.FC<{
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

  const { slug, categories, meta, title, populatedAuthors } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors) !== "";

  const sanitizedDescription = description?.replace(/\s/g, " "); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  return (
    <article
      className={cn("max-w-md w-full group/card rounded-2xl", className)}
      ref={card.ref}
    >
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-96 rounded-2xl shadow-xl  max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
      >
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== "string" && (
          <Media
            resource={metaImage}
            size="33vw"
            fill={true}
            className="bg-cover"
          ></Media>
        )}
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          {hasAuthors && (
            <div className="flex flex-col top-2 absolute">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {formatAuthors(populatedAuthors)}
              </p>
              <p className="text-sm text-gray-400">2 min read</p>
            </div>
          )}
        </div>

        <div className="text content">
          {titleToUse && (
            <div className="prose">
              <h3 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
                <Link className="not-prose" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              </h3>
            </div>
          )}
          {description && (
            <div className="font-normal text-sm text-gray-50 relative z-10 my-4">
              {description && <p>{sanitizedDescription}</p>}
            </div>
          )}
        </div>
      </div>
      {showCategories && hasCategories && (
        <div className="relative my-4">
          {categories?.map((category, index) => {
            if (typeof category === "object") {
              const { title: titleFromCategory } = category;

              const categoryTitle = titleFromCategory || "Untitled category";

              const isLast = index === categories.length - 1;

              return (
                <Link
                  key={index}
                  className={cn(
                    badgeVariants({ variant: "default" }),
                    "dark:bg-zinc-700 bg-gray-500 text-1xl px-2 py-1 rounded-2xl"
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
    </article>
  );
};
