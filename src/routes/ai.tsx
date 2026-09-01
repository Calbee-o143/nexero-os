import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Plus, Trash2, Bot, User } from "lucide-react";
import { Page, PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalState } from "@/lib/local";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "NexOS AI — Offline Demo Assistant" },
      {
        name: "description",
        content:
          "A local demo assistant in NexOS. Responses are generated offline in your browser and chat history is stored in localStorage.",
      },
      { property: "og:title", content: "NexOS AI — Offline Demo Assistant" },
      {
        property: "og:description",
        content: "Demo chat interface with locally stored history. No external model connected.",
      },
    ],
  }),
  component: AiPage,
});

type Msg = { role: "user" | "assistant"; content: string; at: number };
type Conversation = { id: string; title: string; messages: Msg[]; at: number };

const SUGGESTIONS = [
  "What can NexOS do?",
  "Give me a productivity tip",
  "Explain localStorage simply",
  "Suggest a game to play",
];

function demoReply(input: string): string {
  const q = input.toLowerCase().trim();
  const note = "(Demo response — no AI model is connected.)";
  if (/nexos|what can you/.test(q))
    return `NexOS bundles a dashboard, a games library, an app launcher, this demo chat, a movie catalog, a local music player, a code playground and a settings panel. Everything persists in your browser. ${note}`;
  if (/localstorage|storage/.test(q))
    return `localStorage is a small key-value box your browser keeps per site. NexOS writes your settings, playlists and projects there, so they survive refreshes but never leave your device. ${note}`;
  if (/game/.test(q))
    return `Try Lightpath Memory for a calm session, or Reflex Grid if you want something fast. Both live under Games. ${note}`;
  if (/tip|productiv/.test(q))
    return `Pick one task, set a 25 minute timer, and put everything else in a "later" list. The list is what makes it work. ${note}`;
  if (/hello|hi\b|hey/.test(q)) return `Hey. Ask me anything — I answer from a small local script. ${note}`;
  if (q.endsWith("?"))
    return `Good question. This build answers from a tiny offline rule set, so I can only sketch an answer: "${input.slice(0, 120)}". Connect a real model later to get depth here. ${note}`;
  return `Noted: "${input.slice(0, 140)}". I am a local demo, so I can echo, summarise and suggest, but I cannot reason or browse. ${note}`;
}

const newConversation = (): Conversation => ({
  id: Math.random().toString(36).slice(2),
  title: "New chat",
  messages: [],
  at: Date.now(),
});

function AiPage() {
  const [convos, setConvos] = useLocalState<Conversation[]>("nexos.ai.conversations", []);
  const [activeId, setActiveId] = useLocalState<string | null>("nexos.ai.active", null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = convos.find((c) => c.id === activeId) ?? convos[0] ?? null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, typing]);

  function send(text: string) {
    const content = text.trim();
    if (!content) return;
    setDraft("");
    const userMsg: Msg = { role: "user", content, at: Date.now() };

    setConvos((prev) => {
      const list = prev.length ? [...prev] : [newConversation()];
      const id = active?.id ?? list[0].id;
      const idx = list.findIndex((c) => c.id === id);
      const target = list[idx] ?? list[0];
      const updated: Conversation = {
        ...target,
        title: target.messages.length ? target.title : content.slice(0, 38),
        messages: [...target.messages, userMsg],
        at: Date.now(),
      };
      list[idx >= 0 ? idx : 0] = updated;
      setActiveId(updated.id);
      return list;
    });

    setTyping(true);
    window.setTimeout(() => {
      const reply: Msg = { role: "assistant", content: demoReply(content), at: Date.now() };
      setConvos((prev) =>
        prev.map((c) =>
          c.id === (active?.id ?? prev[0]?.id)
            ? { ...c, messages: [...c.messages, reply], at: Date.now() }
            : c,
        ),
      );
      setTyping(false);
    }, 550);
  }

  function startNew() {
    const c = newConversation();
    setConvos((prev) => [c, ...prev]);
    setActiveId(c.id);
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Assistant"
        title="NexOS AI"
        description="A demo assistant that runs entirely in your browser. Replies come from a small local script, not a language model."
        action={
          <Button onClick={startNew} className="gap-2">
            <Plus className="h-4 w-4" /> New chat
          </Button>
        }
      />

      <div className="mb-4 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
        <Badge className="mr-2">Demo mode</Badge>
        No AI provider is connected. Chats are stored locally in your browser only.
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="glass-panel h-fit">
          <CardContent className="p-2">
            <ul className="space-y-1">
              {convos.length === 0 && (
                <li className="px-3 py-4 text-sm text-muted-foreground">No conversations yet.</li>
              )}
              {convos.map((c) => (
                <li key={c.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "flex-1 truncate rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                      active?.id === c.id && "bg-primary text-primary-foreground",
                    )}
                  >
                    {c.title}
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${c.title}`}
                    onClick={() => setConvos((prev) => prev.filter((x) => x.id !== c.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-panel flex h-[62vh] min-h-[420px] flex-col">
          <ScrollArea className="flex-1 p-4">
            {!active || active.messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                <Bot className="h-10 w-10 text-primary" />
                <p className="text-sm text-muted-foreground">Start with a suggestion:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} size="sm" variant="secondary" onClick={() => send(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {active.messages.map((m, i) => (
                  <li
                    key={i}
                    className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                  >
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                      {m.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </span>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {m.content}
                    </div>
                  </li>
                ))}
                {typing && (
                  <li className="text-sm text-muted-foreground">NexOS AI is typing…</li>
                )}
              </ul>
            )}
            <div ref={endRef} />
          </ScrollArea>

          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label className="sr-only" htmlFor="ai-input">
              Message
            </label>
            <Input
              id="ai-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask the demo assistant…"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </Page>
  );
}
