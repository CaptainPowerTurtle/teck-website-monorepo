import { getCachedGlobal } from "@/libs/utils/getGlobals";
import Link from "next/link";
import React from "react";
import type { Footer } from "@/payload-types";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { LogoCarousel } from "@ui/components/ui/logo-carousel";
import { SiGithub } from "@icons-pack/react-simple-icons";

import { ThemeSelector } from "@/libs/providers/Theme/ThemeSelector";
import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import { FooterClient } from "./Component.client";

export async function Footer() {
  const footerData: Footer = await getCachedGlobal("footer", 1)();

  const navItems = footerData?.navItems || [];

  // return <FooterClient data={footerData} />;

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Stay Connected
            </h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to be notified about new articles.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Made with</h3>
            <nav className="space-y-2 text-sm">
              {/* {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  appearance={"ghost"}
                  className="text-white"
                  key={i}
                  {...link}
                />
              );
            })} */}

              <LogoCarousel columnCount={3} />
            </nav>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Me</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/CaptainPowerTurtle"
                      >
                        <SiGithub className="h-4 w-4" />
                        <span className="sr-only">Github</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visit my Github!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.linkedin.com/in/jacob-larsen-405356120"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with me on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Teck. All rights reserved.
          </p>
          {/* <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
          </nav> */}
        </div>
      </div>
    </footer>
  );
}
