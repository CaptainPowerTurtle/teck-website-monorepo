"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SVGProps,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  SiTypescript,
  SiTypescriptHex,
  SiNextdotjs,
  SiTailwindcss,
  SiTailwindcssHex,
  SiNextra,
  SiGithub,
  SiStorybook,
  SiStorybookHex,
  SiPayloadcms,
  SiReact,
  SiReactHex,
} from "@icons-pack/react-simple-icons";

// Define the structure for our logo objects
interface Logo {
  name: string;
  id: number;
  img: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Utility function to randomly shuffle an array
// This is used to mix up the order of logos for a more dynamic display
const shuffleArray = <T extends {}>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Narrow down the types to ensure both elements are defined
    [shuffled[i], shuffled[j]] = [shuffled[j] as T, shuffled[i] as T];
  }
  return shuffled;
};

// Utility function to distribute logos across multiple columns
// This ensures each column has a balanced number of logos
const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const shuffled = shuffleArray(allLogos);
  const columns: Logo[][] = Array.from({ length: columnCount }, () => []);

  // Distribute logos evenly across columns
  shuffled.forEach((logo, index) => {
    columns[index % columnCount]!.push(logo);
  });

  // Ensure all columns have the same number of logos by filling shorter columns
  const maxLength = Math.max(...columns.map((col) => col.length));
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)]!);
    }
  });

  return columns;
};

// Props for the LogoColumn component
interface LogoColumnProps {
  logos: Logo[];
  index: number;
  currentTime: number;
}

// LogoColumn component: Displays a single column of animated logos
const LogoColumn: React.FC<LogoColumnProps> = ({
  logos,
  index,
  currentTime,
}) => {
  const cycleInterval = 2000; // Time each logo is displayed (in milliseconds)
  const columnDelay = index * 200; // Stagger the start of each column's animation
  // Calculate which logo should be displayed based on the current time
  const adjustedTime =
    (currentTime + columnDelay) % (cycleInterval * logos.length);
  const currentIndex = Math.floor(adjustedTime / cycleInterval);

  // Memoize the current logo to prevent unnecessary re-renders
  const CurrentLogo = useMemo(
    () => logos[currentIndex]!.img,
    [logos, currentIndex]
  );

  return (
    // Framer Motion component for the column container
    <motion.div
      className="w-24 h-14 md:w-48 md:h-24 overflow-hidden relative"
      initial={{ opacity: 0, y: 50 }} // Start invisible and below final position
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and final position
      transition={{
        delay: index * 0.1, // Stagger the animation of each column
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {/* AnimatePresence enables animation of components that are removed from the DOM */}
      <AnimatePresence mode="wait">
        {/* Framer Motion component for each logo */}
        <motion.div
          key={`${logos[currentIndex]?.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          // Animation for when the logo enters
          initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
          // Animation for when the logo is displayed
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 1,
              bounce: 0.2,
              duration: 0.5,
            },
          }}
          // Animation for when the logo exits
          exit={{
            y: "-20%",
            opacity: 0,
            filter: "blur(6px)",
            transition: {
              type: "tween",
              ease: "easeIn",
              duration: 0.3,
            },
          }}
        >
          <CurrentLogo className="w-20 h-20 md:w-32 md:h-32 max-w-[80%] max-h-[80%] object-contain" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
// Main LogoCarousel component
function LogoCarousel({ columnCount = 2 }: { columnCount?: number }) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // Memoize the array of logos to prevent unnecessary re-renders
  const allLogos: Logo[] = useMemo(
    () => [
      { name: "Nextjs", id: 1, img: NextjsIcon },
      { name: "Tailwind", id: 2, img: TailwindCSSIcon },
      { name: "Typescript", id: 3, img: TypeScriptIcon },
      { name: "Payload", id: 4, img: PayloadCMSIcon },
      { name: "Github", id: 5, img: GithubIcon },
      { name: "React", id: 6, img: ReactIcon },
      { name: "Storybook", id: 7, img: StorybookIcon },
      { name: "Nextra", id: 8, img: NextraIcon },
    ],
    []
  );

  // Distribute logos across columns when the component mounts
  useEffect(() => {
    const distributedLogos = distributeLogos(allLogos, columnCount);
    setLogoSets(distributedLogos);
  }, [allLogos]);

  // Function to update the current time (used for logo cycling)
  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100);
  }, []);

  // Set up an interval to update the time every 100ms
  useEffect(() => {
    const intervalId = setInterval(updateTime, 100);
    return () => clearInterval(intervalId);
  }, [updateTime]);

  // Render the logo columns
  return (
    <div className="flex space-x-4">
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          logos={logos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}

const TypeScriptIcon = (props: SVGProps<SVGSVGElement>) => (
  <SiTypescript size={30} color={SiTypescriptHex} />
);
const PayloadCMSIcon = (props: SVGProps<SVGSVGElement>) => (
  <SiPayloadcms size={30} />
);
const TailwindCSSIcon = (props: SVGProps<SVGSVGElement>) => (
  <SiTailwindcss color={SiTailwindcssHex} size={30} />
);

const NextjsIcon = (props: SVGProps<SVGSVGElement>) => (
  //   <img
  //     width={50}
  //     height={50}
  //     src="/logos/nextjs-logo.svg"
  //     className="invert-0 dark:invert"
  //   />
  <SiNextdotjs size={30} />
);
const GithubIcon = (props: SVGProps<SVGSVGElement>) => <SiGithub size={24} />;
const ReactIcon = (props: SVGProps<SVGSVGElement>) => (
  <SiReact color={SiReactHex} size={30} />
);
const StorybookIcon = (props: SVGProps<SVGSVGElement>) => (
  <SiStorybook color={SiStorybookHex} size={30} />
);
const NextraIcon = (props: SVGProps<SVGSVGElement>) => <SiNextra size={30} />;
export { LogoCarousel };
