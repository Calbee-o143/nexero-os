import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { Page, PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalState } from "@/lib/local";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Games — NexOS Safe Browser Game Library" },
      {
        name: "description",
        content:
          "Play original, lightweight browser games built into NexOS: memory, reflex, tactics and number puzzles. No downloads, no proxies.",
      },
      { property: "og:title", content: "Games — NexOS" },
      {
        property: "og:description",
        content: "A small library of original browser games with search and filters.",
      },
    ],
  }),
  component: GamesPage,
});

type GameId = "memory" | "reflex" | "tactics" | "guess";
type GameMeta = {
  id: GameId;
  name: string;
  tagline: string;
  genre: string;
  emoji: string;
  difficulty: "Easy" | "Medium";
};

const GAMES: GameMeta[] = [
  {
    id: "memory",
    name: "Lightpath Memory",
    tagline: "Match glowing pairs before your move count climbs.",
    genre: "Puzzle",
    emoji: "🔮",
    difficulty: "Easy",
  },
  {
    id: "reflex",
    name: "Reflex Grid",
    tagline: "Tap the lit cell as fast as you can for 20 seconds.",
    genre: "Arcade",
    emoji: "⚡",
    difficulty: "Medium",
  },
  {
    id: "tactics",
    name: "Nine Squares",
    tagline: "Classic three-in-a-row against a scrappy opponent.",
    genre: "Strategy",
    emoji: "⭕",
    difficulty: "Easy",
  },
  {
    id: "guess",
    name: "Signal Lock",
    tagline: "Narrow down the hidden frequency between 1 and 100.",
    genre: "Logic",
    emoji: "📡",
    difficulty: "Easy",
  },
];

/* ---------------- Memory ---------------- */
const ICONS = ["🌙", "⭐", "�See", "🪐", "☄️", "🌌"].map((s) => (s === "🌊See" ? "🌊" : s));

function MemoryGame() {
  const deck = useMemo(() => {
    const base = ["🌙", "⭐", "🪐", "☄️", "🌌", "🛰️"];
    const cards = [...base, ...base].map((icon, i) => ({ icon, key: i }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j]!, cards[i]!];
    }
    return cards;
  }, []);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped as [number, number];
    setMoves((m) => m + 1);
    const t = window.setTimeout(() => {
      if (deck[a]!.icon === deck[b]!.icon) setMatched((m) => [...m, deck[a]!.icon]);
      setFlipped([]);
    }, 650);
    return () => clearTimeout(t);
  }, [flipped, deck]);

  const done = matched.length === 6;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Moves: <span className="font-semibold text-foreground">{moves}</span>
        {done && " — cleared! Reopen the game for a new board."}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card, i) => {
          const open = flipped.includes(i) || matched.includes(card.icon);
          return (
            <button
              key={card.key}
              aria-label={open ? `Card ${card.icon}` : "Hidden card"}
              onClick={() =>
                !open && flipped.length < 2 && setFlipped((f) => [...f, i])
              }
              className={cn(
                "grid aspect-square place-items-center rounded-2xl border border-border text-2xl transition-all duration-300",
                open ? "bg-primary/20 border-primary" : "bg-secondary hover:bg-secondary/70",
              )}
            >
              {open ? card.icon : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Reflex ---------------- */
function ReflexGame() {
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time]);

  function start() {
    setScore(0);
    setTime(20);
    setRunning(true);
    setTarget(Math.floor(Math.random() * 9));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Score: <span className="font-semibold text-foreground">{score}</span>
        </span>
        <span>
          Time: <span className="font-semibold text-foreground">{time}s</span>
        </span>
        <Button size="sm" onClick={start} className="ml-auto">
          {running ? "Restart" : "Start"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            aria-label={`Cell ${i + 1}${target === i && running ? " (active)" : ""}`}
            disabled={!running}
            onClick={() => {
              if (i === target) {
                setScore((s) => s + 1);
                setTarget(Math.floor(Math.random() * 9));
              } else {
                setScore((s) => Math.max(0, s - 1));
              }
            }}
            className={cn(
              "aspect-square rounded-2xl border border-border transition-colors",
              running && target === i ? "bg-primary glow-ring" : "bg-secondary",
            )}
          />
        ))}
      </div>
      {!running && time === 0 && (
        <p className="text-sm text-muted-foreground">Time up — final score {score}.</p>
      )}
    </div>
  );
}

/* ---------------- Tic tac toe ---------------- */
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(b: (string | null)[]) {
  for (const [a, c, d] of LINES) {
    if (b[a!] && b[a!] === b[c!] && b[a!] === b[d!]) return b[a!];
  }
  return b.every(Boolean) ? "draw" : null;
}

function TacticsGame() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const result = winnerOf(board);

  function play(i: number) {
    if (board[i] || result) return;
    const next = [...board];
    next[i] = "X";
    const w = winnerOf(next);
    if (!w) {
      const free = next.map((v, idx) => (v ? -1 : idx)).filter((v) => v >= 0);
      const pick = free[Math.floor(Math.random() * free.length)];
      if (pick !== undefined) next[pick] = "O";
    }
    setBoard(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          {result === "draw"
            ? "Draw."
            : result
              ? `${result} wins.`
              : "Your move — you are X."}
        </span>
        <Button size="sm" variant="secondary" onClick={() => setBoard(Array(9).fill(null))}>
          New round
        </Button>
      </div>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            aria-label={`Square ${i + 1}${cell ? `, ${cell}` : ", empty"}`}
            onClick={() => play(i)}
            className="grid aspect-square place-items-center rounded-2xl border border-border bg-secondary text-2xl font-bold transition-colors hover:border-primary"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Guess ---------------- */
function GuessGame() {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("Pick a number between 1 and 100.");
  const [tries, setTries] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(value);
    if (!n) return;
    setTries((t) => t + 1);
    if (n === secret) setHint(`Locked in ${tries + 1} tries. Press reset for a new signal.`);
    else setHint(n < secret ? "Signal is higher." : "Signal is lower.");
    setValue("");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">{hint}</p>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="guess">
          Your guess
        </label>
        <Input
          id="guess"
          type="number"
          min={1}
          max={100}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="submit">Try</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setSecret(Math.floor(Math.random() * 100) + 1);
            setTries(0);
            setHint("New signal generated.");
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

function GamesPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [active, setActive] = useState<GameMeta | null>(null);
  const [favorites, setFavorites] = useLocalState<string[]>("nexos.games.favorites", []);

  const genres = ["All", ...Array.from(new Set(GAMES.map((g) => g.genre)))];
  const visible = GAMES.filter((g) => (genre === "All" ? true : g.genre === genre)).filter(
    (g) => !query || `${g.name} ${g.tagline} ${g.genre}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Page>
      <PageHeader
        eyebrow="Arcade"
        title="Games"
        description="Original, lightweight games that run entirely in this tab. No downloads and no external sites."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            aria-label="Search games"
            placeholder="Search games"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <Button
              key={g}
              size="sm"
              variant={g === genre ? "default" : "secondary"}
              onClick={() => setGenre(g)}
            >
              {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((g) => (
          <Card key={g.id} className="glass-panel card-hover">
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">
                  {g.emoji}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={
                    favorites.includes(g.id) ? `Unfavorite ${g.name}` : `Favorite ${g.name}`
                  }
                  onClick={() =>
                    setFavorites((f) =>
                      f.includes(g.id) ? f.filter((x) => x !== g.id) : [...f, g.id],
                    )
                  }
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(g.id) && "fill-primary text-primary",
                    )}
                  />
                </Button>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">{g.name}</h2>
                <p className="text-sm text-muted-foreground">{g.tagline}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <div className="flex gap-2">
                  <Badge variant="secondary">{g.genre}</Badge>
                  <Badge variant="outline">{g.difficulty}</Badge>
                </div>
                <Button size="sm" onClick={() => setActive(g)}>
                  Play
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
          No games match that search.
        </p>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="glass-panel max-w-lg">
          <DialogHeader>
            <DialogTitle>{active?.name}</DialogTitle>
            <DialogDescription>{active?.tagline}</DialogDescription>
          </DialogHeader>
          {active?.id === "memory" && <MemoryGame />}
          {active?.id === "reflex" && <ReflexGame />}
          {active?.id === "tactics" && <TacticsGame />}
          {active?.id === "guess" && <GuessGame />}
        </DialogContent>
      </Dialog>
    </Page>
  );
}

void ICONS;
