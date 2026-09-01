import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalState } from "./local";

export type Palette = "violet" | "cyan" | "ember" | "forest" | "rose";
export type Performance = "high" | "balanced" | "low";
export type SearchPref = "duckduckgo" | "google" | "bing" | "wikipedia";

export type Settings = {
  palette: Palette;
  stars: boolean;
  island: boolean;
  performance: Performance;
  searchEngine: SearchPref;
  debug: boolean;
  ownerMode: boolean;
  displayName: string;
};

export const DEFAULT_SETTINGS: Settings = {
  palette: "violet",
  stars: true,
  island: true,
  performance: "high",
  searchEngine: "duckduckgo",
  debug: false,
  ownerMode: false,
  displayName: "Explorer",
};

export const PALETTES: Record<Palette, { label: string; hue: number; hue2: number }> = {
  violet: { label: "Midnight Violet", hue: 278, hue2: 210 },
  cyan: { label: "Deep Cyan", hue: 215, hue2: 175 },
  ember: { label: "Ember Dusk", hue: 40, hue2: 15 },
  forest: { label: "Nocturne Forest", hue: 155, hue2: 190 },
  rose: { label: "Rose Eclipse", hue: 340, hue2: 290 },
};

export const SEARCH_ENGINES: Record<SearchPref, { label: string; url: string }> = {
  duckduckgo: { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  google: { label: "Google", url: "https://www.google.com/search?q=" },
  bing: { label: "Bing", url: "https://www.bing.com/search?q=" },
  wikipedia: { label: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?search=" },
};

type Ctx = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalState<Settings>("nexos.settings", DEFAULT_SETTINGS);

  const merged = useMemo(() => ({ ...DEFAULT_SETTINGS, ...settings }), [settings]);

  useEffect(() => {
    const p = PALETTES[merged.palette] ?? PALETTES.violet;
    const root = document.documentElement;
    root.style.setProperty("--hue", String(p.hue));
    root.style.setProperty("--hue2", String(p.hue2));
    root.classList.toggle("perf-low", merged.performance === "low");
  }, [merged.palette, merged.performance]);

  const value = useMemo<Ctx>(
    () => ({
      settings: merged,
      update: (key, val) => setSettings((s) => ({ ...DEFAULT_SETTINGS, ...s, [key]: val })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [merged, setSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
