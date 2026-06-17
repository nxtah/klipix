"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./button";

let hasHydrated = false;
const hydrationListeners = new Set<() => void>();

function subscribeHydration(listener: () => void) {
  hydrationListeners.add(listener);

  if (!hasHydrated) {
    hasHydrated = true;
    queueMicrotask(() => {
      hydrationListeners.forEach((notify) => notify());
    });
  }

  return () => {
    hydrationListeners.delete(listener);
  };
}

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => hasHydrated,
    () => false,
  );
}

export function ThemeToggle() {
  const mounted = useHasHydrated();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full pointer-events-none opacity-60">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
