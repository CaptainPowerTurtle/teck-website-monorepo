"use client";
import React, { useEffect } from "react";

import type { Page } from "@/payload-types";

import RichText from "@/components/RichText";
import { GridBeam } from "@repo/ui/components/ui/grid-beam";
import { Spotlight } from "@repo/ui/components/ui/spotlight-new";
import { CMSLink } from "@/components/Link";
import { useHeaderTheme } from "@/libs/providers/HeaderTheme";

export const GridBeamHero: React.FC<Page["hero"]> = ({ links, richText }) => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme("dark");
  });
  return (
    <div className="antialiased w-full flex min-h-[80vh] dark:bg-grid-white/[0.05] bg-grid-black/[0.07] relative overflow-hidden items-center justify-center text-black dark:text-white">
      <Spotlight />
      <GridBeam className="sm:pl-16 pt-28 container">
        <div className="max-w-[36.5rem]">
          {richText && (
            <RichText className="mb-6" data={richText} enableGutter={false} />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </GridBeam>
    </div>
  );
};
