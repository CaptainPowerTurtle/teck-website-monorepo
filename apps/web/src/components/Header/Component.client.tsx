"use client";
import { useHeaderTheme } from "@/libs/providers/HeaderTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import type { Header } from "@/payload-types";

import { Logo } from "@/components/Logo/Logo";
import { HeaderNav } from "./Nav";
import { ThemeToggle } from "../ThemeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { Button } from "@ui/components/ui/button";
import { Menu, X } from "lucide-react";
import { CMSLink } from "../Link";
import { Separator } from "@ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const navItems = data?.navItems || [];

  useEffect(() => {
    setHeaderTheme(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Toggling menu. Current state:", isOpen);
    setIsOpen(!isOpen);
  };

  // return (
  //   <header
  //     className="w-full z-40 sticky top-0 left-0 bg-background"
  //     {...(theme ? { "data-theme": theme } : {})}
  //   >
  //     <div className="px-8 flex justify-between items-center">
  //       <Link href="/">
  //         <Logo
  //           loading="eager"
  //           priority="high"
  //           className="invert-0 dark:invert"
  //         />
  //       </Link>
  //       <HeaderNav data={data} />
  //       <ModeToggle />
  //     </div>
  //   </header>
  // );
  return (
    <>
      <header
        className="w-full z-40 sticky top-0 left-0 bg-background border-b"
        {...(theme ? { "data-theme": theme } : {})}
      >
        <div className="container mx-auto">
          <div className="flex items-center h-16 justify-between">
            {/* Logo and Mobile Menu Button Container */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <div className="md:hidden mr-2">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleMenu}>
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open main menu</span>
                    </Button>
                  </SheetTrigger>
                </Sheet>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Logo
                    loading="eager"
                    priority="high"
                    className="invert-0 dark:invert w-10 h-10"
                  />
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center space-x-4 flex-1">
              {navItems.map(({ link }, i) => {
                return <CMSLink key={i} {...link} appearance={"ghost"} />;
              })}
            </div>
            <div className="md:flex items-center">
              <ThemeToggle />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/CaptainPowerTurtle/teck-website-monorepo"
                      >
                        <SiGithub className="h-4 w-4" />
                        <span className="sr-only">Github</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View the code!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTitle></SheetTitle>
        <SheetContent
          side="left"
          className="[&>button]:hidden w-full sm:w-[400px] p-0 "
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b h-16">
              <Link href="/" className="flex items-center">
                <Logo
                  loading="eager"
                  priority="high"
                  className="invert-0 dark:invert w-10 h-10"
                />
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col space-y-2 p-4">
                {navItems.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      appearance={"ghost"}
                      className="justify-start"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
