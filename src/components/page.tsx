import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
