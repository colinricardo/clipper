"use client";

import { LucideIcon, Moon, SunMedium } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
};

import { useTheme } from "next-themes";

export default () => {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className="cursor-pointer"
      tabIndex={-1}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icons.sun className="transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
        <Icons.moon className="absolute transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      </div>
    </div>
  );
};
