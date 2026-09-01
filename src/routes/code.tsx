import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Save, FolderOpen, Trash2, Download } from "lucide-react";
import { Page, PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocalState } from "@/lib/local";
import { toast } from "sonner";

export const Route = createFileRoute("/code")({
  head: () => ({
    meta: [
      { title: "Code Playground — NexOS Editor" },
      {
        name: "description",
        content:
          "Write HTML, CSS and JavaScript in NexOS and run it instantly in a sandboxed preview. Projects save to your browser.",
      },
      { property: "og:title", content: "Code Playground — NexOS" },
      {
        property: "og:description",
        content: "HTML/CSS/JS editor with sandboxed live preview and local project storage.",
      },
    ],
  }),
  component: CodePage,
});

type Project = { id: string; name: string; html: string; css: string; js: string; at: number };

const STARTER = {
  html: `<div class="card">
  <h1>Hello from NexOS</h1>
  <p>Edit the tabs and press Run.</p>
  <button id="go">Count: 0</button>
</div>`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #0d0b18;
  color: #eae7ff;
}
.card {
  padding: 2rem;
  border-radius: 18px;
  background: #171331;
  box-shadow: 0 20px 60px -20px #7c5cff88;
  text-align: center;
}
button {
  margin-top: 1rem;
  padding: .6rem 1.2rem;
  border: 0;
  border-radius: 999px;
  background: #7c5cff;
  color: white;
  cursor: pointer;
}`,
  js: `let n = 0;
const btn = document.getElementById("go");
btn.addEventListener("click", () => {
  n += 1;
  btn.textContent = "Count: " + n;
});`,
};

function buildDoc(html: string, css: string, js: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>try{${js}}catch(e){document.body.insertAdjacentHTML("beforeend","<pre style=\\"color:#ff8a8a;font:12px monospace\\">"+e+"</pre>")}<\/script></body></html>`;
}

function CodePage() {
  const [html, setHtml] = useLocalState("nexos.code.html", STARTER.html);
  const [css, setCss] = useLocalState("nexos.code.css", STARTER.css);
  const [js, setJs] = useLocalState("nexos.code.js", STARTER.js);
  const [projects, setProjects] = useLocalState<Project[]>("nexos.code.projects", []);
  const [name, setName] = useState("My project");
  const [doc, setDoc] = useState("");
  const firstRun = useRef(true);

  const current = useMemo(() => buildDoc(html, css, js), [html, css, js]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      setDoc(current);
    }
  }, [current]);

  function run() {
    setDoc(current);
    toast.success("Preview updated");
  }

  function save() {
    const project: Project = {
      id: Math.random().toString(36).slice(2),
      name: name.trim() || "Untitled",
      html,
      css,
      js,
      at: Date.now(),
    };
    setProjects((p) => [project, ...p].slice(0, 25));
    toast.success(`Saved "${project.name}"`);
  }

  function load(p: Project) {
    setHtml(p.html);
    setCss(p.css);
    setJs(p.js);
    setName(p.name);
    setDoc(buildDoc(p.html, p.css, p.js));
    toast.success(`Loaded "${p.name}"`);
  }

  function reset() {
    setHtml(STARTER.html);
    setCss(STARTER.css);
    setJs(STARTER.js);
    setDoc(buildDoc(STARTER.html, STARTER.css, STARTER.js));
    toast("Editor reset to the starter template");
  }

  function download() {
    const blob = new Blob([current], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || "nexos-project").replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const editorClass =
    "h-[46vh] min-h-[300px] w-full resize-none rounded-2xl border border-border bg-background/60 p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none focus-visible:border-primary";

  return (
    <Page>
      <PageHeader
        eyebrow="Playground"
        title="Code"
        description="Edit HTML, CSS and JavaScript, then run it in a sandboxed iframe. Nothing is uploaded."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={run} className="gap-2">
              <Play className="h-4 w-4" /> Run
            </Button>
            <Button onClick={save} variant="secondary" className="gap-2">
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button onClick={download} variant="secondary" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={reset} variant="ghost" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass-panel">
          <CardContent className="p-4">
            <Tabs defaultValue="html">
              <TabsList className="mb-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JS</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <textarea
                  aria-label="HTML editor"
                  spellCheck={false}
                  className={editorClass}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="css">
                <textarea
                  aria-label="CSS editor"
                  spellCheck={false}
                  className={editorClass}
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="js">
                <textarea
                  aria-label="JavaScript editor"
                  spellCheck={false}
                  className={editorClass}
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Preview
              </h2>
              <span className="text-xs text-muted-foreground">sandboxed iframe</span>
            </div>
            <iframe
              title="Code preview"
              sandbox="allow-scripts allow-modals"
              srcDoc={doc}
              className="h-[46vh] min-h-[300px] w-full rounded-2xl border border-border bg-background"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel mt-6">
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <FolderOpen className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold">Saved projects</h2>
            <div className="ml-auto w-full max-w-xs">
              <label className="sr-only" htmlFor="project-name">
                Project name
              </label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
              />
            </div>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved projects yet — press Save to store the current tabs.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-xl border border-border px-3 py-2"
                >
                  <button
                    className="flex-1 truncate text-left text-sm hover:text-primary"
                    onClick={() => load(p)}
                  >
                    {p.name}
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${p.name}`}
                    onClick={() => setProjects((prev) => prev.filter((x) => x.id !== p.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
