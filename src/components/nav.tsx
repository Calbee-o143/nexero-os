import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Gamepad2,
  LayoutGrid,
  Sparkles,
  Clapperboard,
  Music2,
  Code2,
  Settings as SettingsIcon,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/apps", label: "Apps", icon: LayoutGrid },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/movies", label: "Movies", icon: Clapperboard },
  { to: "/music", label: "Music", icon: Music2 },
  { to: "/code", label: "Code", icon: Code2 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/about", label: "About", icon: Info },
] as const;

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums text-xs text-muted-foreground">{now ?? "--:--"}</span>;
}

export function TopNav() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "glass-panel flex w-full max-w-4xl items-center gap-1 rounded-3xl px-2 py-2 transition-all duration-500",
            settings.island && "sm:rounded-full",
          )}
        >
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-display text-sm font-bold tracking-tight"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-black text-primary-foreground">
              N
            </span>
            <span className="text-gradient">NexOS</span>
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 pr-1 lg:ml-0">
            <Clock />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-20 z-40 px-3 lg:hidden">
          <ul className="glass-panel grid grid-cols-2 gap-1 rounded-3xl p-2 sm:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function DebugOverlay() {
  const { settings } = useSettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [size, setSize] = useState("");

  useEffect(() => {
    const onResize = () => setSize(`${window.innerWidth}x${window.innerHeight}`);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!settings.debug) return null;

  return (
    <div className="glass-panel pointer-events-none fixed bottom-3 left-3 z-50 rounded-xl px-3 py-2 font-mono text-[11px] text-muted-foreground">
      <div>route: {pathname}</div>
      <div>viewport: {size}</div>
      <div>palette: {settings.palette}</div>
      <div>perf: {settings.performance}</div>
      <div>owner: {settings.ownerMode ? "on" : "off"}</div>
    </div>
  );
}
