import React from "react";

import type { Page } from "@/payload-types";

import { LowImpactHero } from "@/libs/heros/LowImpact";
import { MediumImpactHero } from "@/libs/heros/MediumImpact";
import { GridBeamHero } from "./GridBeam";

const heroes = {
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  gridBeam: GridBeamHero,
};

export const RenderHero: React.FC<Page["hero"]> = (props) => {
  const { type } = props || {};

  if (!type || type === "none") return null;

  const HeroToRender = heroes[type];

  if (!HeroToRender) return null;

  return <HeroToRender {...props} />;
};
