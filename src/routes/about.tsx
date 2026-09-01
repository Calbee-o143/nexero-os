import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NexOS — Version, Credits & Technology" },
      {
        name: "description",
        content:
          "Learn about NexOS: an original, offline-friendly midnight dashboard with games, apps, AI demo, movies, music and a code playground.",
      },
      { property: "og:title", content: "About NexOS" },
      {
        property: "og:description",
        content: "Version, credits, technology stack and privacy information for NexOS.",
      },
    ],
  }),
  component: AboutPage,
});

export const NEXOS_VERSION = "1.0.0";

const TECH = [
  ["React 19", "Component runtime for the whole interface"],
  ["TanStack Start & Router", "File-based routing and server rendering"],
  ["Tailwind CSS v4", "CSS-first design tokens and utilities"],
  ["Radix + shadcn UI", "Accessible primitives for dialogs, tabs, sliders"],
  ["Web Audio / HTMLAudio", "Local music playback from your own files"],
  ["localStorage", "All preferences and content stay on your device"],
];

function AboutPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="About"
        title="NexOS"
        description="An original midnight-themed personal dashboard. Everything runs locally in your browser."
        action={<Badge variant="secondary">v{NEXOS_VERSION}</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-panel lg:col-span-2">
          <CardHeader>
            <CardTitle>What NexOS is</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              NexOS is a self-contained dashboard: a launcher, a small library of original browser
              games, a demo AI chat, a movie catalog UI, a local-file music player, and a code
              playground. It is designed to be pleasant on a phone and on a large display.
            </p>
            <p>
              NexOS is an independent project. It is not affiliated with, endorsed by, or derived
              from any other dashboard project. All layout, copy, artwork and code here are
              original.
            </p>
            <Separator />
            <p className="font-medium text-foreground">Explicitly out of scope</p>
            <p>
              NexOS contains no proxy, web-unblocker, cloaking, bypass or network filter
              circumvention functionality, and will not add any. The search-engine setting is a
              display preference that opens a normal new tab — nothing is routed through NexOS.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Design & build: the NexOS maintainer.</p>
            <p>Icons: Lucide (ISC).</p>
            <p>UI primitives: Radix UI (MIT).</p>
            <p>Games, catalog entries and demo copy: written for NexOS.</p>
          </CardContent>
        </Card>

        <Card className="glass-panel lg:col-span-2">
          <CardHeader>
            <CardTitle>Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              {TECH.map(([name, desc]) => (
                <div key={name} className="rounded-xl border border-border/60 p-3">
                  <dt className="text-sm font-semibold">{name}</dt>
                  <dd className="text-xs text-muted-foreground">{desc}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Privacy & legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Privacy (placeholder).</span> NexOS
              stores settings, playlists, chats, projects and favorites in your browser&apos;s
              localStorage. No account is required and nothing is uploaded by the app.
            </p>
            <p>
              <span className="font-medium text-foreground">Media (placeholder).</span> Music plays
              only from files you pick yourself; they never leave your device. Movie entries are
              catalog metadata for demo purposes and provide no streams or downloads.
            </p>
            <p>
              <span className="font-medium text-foreground">Terms (placeholder).</span> Provided
              as-is, without warranty. Replace this section with your own policy before public use.
            </p>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
