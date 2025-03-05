"use client";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <div className="w-6 h-6" />,
});

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
      <div className="flex items-center">
        <span className="sr-only">Acme Inc</span>
      </div>
      <ThemeSwitcher />
    </header>
  );
}
