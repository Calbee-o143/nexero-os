import { useMemo } from "react";
import { useHydrated } from "@/lib/local";
import { useSettings } from "@/lib/settings";

export function Starfield() {
  const { settings } = useSettings();
  const hydrated = useHydrated();

  const count = settings.performance === "low" ? 0 : settings.performance === "balanced" ? 45 : 90;

  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: (i * 37.7) % 100,
        left: (i * 61.3) % 100,
        size: (i % 3) + 1,
        delay: (i % 11) * 0.7,
      })),
    [count],
  );

  if (!hydrated || !settings.stars || count === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-foreground"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: 0.3,
            animation: `twinkle ${4 + (s.id % 5)}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
