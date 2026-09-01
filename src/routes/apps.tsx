import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, Plus, Trash2, ExternalLink, Search } from "lucide-react";
import { Page, PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalState } from "@/lib/local";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title: "Apps — NexOS Launcher & Library" },
      {
        name: "description",
        content:
          "A configurable app launcher in NexOS. Add your own cards, mark favorites and organise tools — all stored locally.",
      },
      { property: "og:title", content: "Apps — NexOS Launcher" },
      {
        property: "og:description",
        content: "Configurable launcher cards with local favorites and categories.",
      },
    ],
  }),
  component: AppsPage,
});

type AppCard = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  emoji: string;
};

const DEFAULT_APPS: AppCard[] = [
  {
    id: "notes",
    name: "Quick Notes",
    description: "Scratchpad in a new tab",
    url: "https://example.com/notes",
    category: "Productivity",
    emoji: "📝",
  },
  {
    id: "calc",
    name: "Calculator",
    description: "Everyday arithmetic",
    url: "https://example.com/calculator",
    category: "Utilities",
    emoji: "🧮",
  },
  {
    id: "weather",
    name: "Weather",
    description: "Forecast at a glance",
    url: "https://example.com/weather",
    category: "Utilities",
    emoji: "⛅",
  },
  {
    id: "draw",
    name: "Sketchboard",
    description: "Freeform drawing canvas",
    url: "https://example.com/draw",
    category: "Creative",
    emoji: "🎨",
  },
  {
    id: "focus",
    name: "Focus Timer",
    description: "25/5 pomodoro cycles",
    url: "https://example.com/focus",
    category: "Productivity",
    emoji: "⏳",
  },
  {
    id: "reader",
    name: "Reader",
    description: "Distraction-free reading",
    url: "https://example.com/reader",
    category: "Reading",
    emoji: "📚",
  },
];

const emptyDraft = { name: "", description: "", url: "", category: "Utilities", emoji: "🚀" };

function AppsPage() {
  const { settings } = useSettings();
  const [apps, setApps] = useLocalState<AppCard[]>("nexos.apps", DEFAULT_APPS);
  const [favorites, setFavorites] = useLocalState<string[]>("nexos.apps.favorites", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [draft, setDraft] = useState(emptyDraft);
  const [open, setOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(apps.map((a) => a.category)))],
    [apps],
  );

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return apps
      .filter((a) => (category === "All" ? true : a.category === category))
      .filter((a) => !q || `${a.name} ${a.description} ${a.category}`.toLowerCase().includes(q))
      .sort(
        (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)),
      );
  }, [apps, category, query, favorites]);

  function toggleFav(id: string) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  function addApp() {
    if (!draft.name.trim()) return;
    setApps((prev) => [
      ...prev,
      { ...draft, id: Math.random().toString(36).slice(2), category: draft.category || "Other" },
    ]);
    setDraft(emptyDraft);
    setOpen(false);
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Launcher"
        title="Apps"
        description="Your own launcher grid. Cards, categories and favorites are saved in this browser."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add app
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel">
              <DialogHeader>
                <DialogTitle>Add an app card</DialogTitle>
                <DialogDescription>
                  Cards open the link in a new tab. NexOS never proxies or embeds the destination.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="app-name">Name</Label>
                  <Input
                    id="app-name"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="app-desc">Description</Label>
                  <Input
                    id="app-desc"
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="app-cat">Category</Label>
                    <Input
                      id="app-cat"
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="app-emoji">Icon</Label>
                    <Input
                      id="app-emoji"
                      value={draft.emoji}
                      maxLength={2}
                      onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="app-url">URL</Label>
                  <Input
                    id="app-url"
                    placeholder="https://"
                    value={draft.url}
                    onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addApp}>Save card</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search apps"
            aria-label="Search apps"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={c === category ? "default" : "secondary"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
          No apps match that search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((app) => (
            <Card key={app.id} className="glass-panel card-hover">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">
                    {app.emoji}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={
                        favorites.includes(app.id)
                          ? `Remove ${app.name} from favorites`
                          : `Add ${app.name} to favorites`
                      }
                      onClick={() => toggleFav(app.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          favorites.includes(app.id) && "fill-primary text-primary",
                        )}
                      />
                    </Button>
                    {settings.ownerMode && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${app.name}`}
                        onClick={() => setApps((prev) => prev.filter((a) => a.id !== app.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">{app.name}</h2>
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <Badge variant="secondary">{app.category}</Badge>
                  <Button asChild size="sm" variant="secondary" className="gap-1.5">
                    <a href={app.url} target="_blank" rel="noreferrer noopener">
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
