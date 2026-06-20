import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PageHeader({
  title, description, action,
}: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function ModuleCard({
  title, description, action, children,
}: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function AddButton({ onClick, label = "New record" }: { onClick: () => void; label?: string }) {
  return (
    <Button onClick={onClick} size="sm" className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
      <Plus className="mr-1 h-4 w-4" /> {label}
    </Button>
  );
}

export function StatPill({ label, value, tone = "default" }:
  { label: string; value: string; tone?: "default" | "success" | "warn" | "danger" }) {
  const colors = {
    default: "bg-muted/40 text-foreground",
    success: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    warn: "bg-[oklch(0.78_0.16_75)]/15 text-[oklch(0.88_0.16_75)]",
    danger: "bg-destructive/15 text-destructive",
  };
  return (
    <div className="glass rounded-lg p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 inline-flex items-center rounded-md px-2 py-1 text-lg font-semibold ${colors[tone]}`}>
        {value}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    active: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    in_use: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    paid: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    approved: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    completed: "bg-[oklch(0.72_0.16_162)]/15 text-[oklch(0.85_0.16_162)]",
    in_progress: "bg-primary/15 text-primary",
    open: "bg-primary/15 text-primary",
    qualified: "bg-primary/15 text-primary",
    proposal: "bg-secondary/15 text-secondary",
    negotiation: "bg-secondary/15 text-secondary",
    pending: "bg-[oklch(0.78_0.16_75)]/15 text-[oklch(0.88_0.16_75)]",
    draft: "bg-muted text-muted-foreground",
    unpaid: "bg-[oklch(0.78_0.16_75)]/15 text-[oklch(0.88_0.16_75)]",
    planning: "bg-secondary/15 text-secondary",
    new: "bg-muted text-muted-foreground",
  };
  const cls = map[s] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
