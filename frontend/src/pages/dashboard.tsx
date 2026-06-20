// @ts-nocheck

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowDownRight, ArrowUpRight, Boxes, DollarSign, TrendingUp, Users,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const revenueData = [
  { m: "Jan", revenue: 42000, profit: 12000 },
  { m: "Feb", revenue: 51000, profit: 17000 },
  { m: "Mar", revenue: 48500, profit: 14800 },
  { m: "Apr", revenue: 62300, profit: 22100 },
  { m: "May", revenue: 71400, profit: 26900 },
  { m: "Jun", revenue: 84200, profit: 32500 },
  { m: "Jul", revenue: 92100, profit: 37800 },
  { m: "Aug", revenue: 88600, profit: 35400 },
  { m: "Sep", revenue: 101200, profit: 42100 },
];

const inventoryData = [
  { w: "Wk 1", in: 240, out: 180 },
  { w: "Wk 2", in: 310, out: 220 },
  { w: "Wk 3", in: 280, out: 260 },
  { w: "Wk 4", in: 360, out: 290 },
  { w: "Wk 5", in: 420, out: 340 },
  { w: "Wk 6", in: 390, out: 410 },
];

const activity = [
  { who: "Sarah Chen", what: "Approved purchase order #PO-2041", when: "2 min ago", tag: "Purchase" },
  { who: "AI Insight", what: "Reorder suggested for SKU-A7732 — stockout in 6 days", when: "12 min ago", tag: "AI" },
  { who: "Marcus Lee", what: "Closed deal · Atlas Logistics · $48,200", when: "1 h ago", tag: "Sales" },
  { who: "Payroll", what: "August payroll run completed (142 employees)", when: "3 h ago", tag: "HR" },
  { who: "AI Insight", what: "Overstock risk detected in Warehouse B (8 SKUs)", when: "5 h ago", tag: "AI" },
];

function Dashboard() {
  const { user, roles } = useAuth();
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, <span className="text-gradient">{name}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your organization today.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full">
          Role: {roles[0] ?? "employee"}
        </Badge>
      </header>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={DollarSign} label="Revenue (MTD)" value="$101,240" delta="+12.4%" up />
        <Kpi icon={TrendingUp} label="Gross profit" value="$42,180" delta="+8.1%" up />
        <Kpi icon={Boxes} label="SKUs in stock" value="1,284" delta="-3.2%" />
        <Kpi icon={Users} label="Active customers" value="328" delta="+5.6%" up />
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & profit</CardTitle>
            <CardDescription>Trailing 9 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.13 210)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.82 0.13 210)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.15 295)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.72 0.15 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="m" stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.035 265)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.82 0.13 210)" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="oklch(0.72 0.15 295)" fill="url(#pro)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Stock movement</CardTitle>
            <CardDescription>Last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="w" stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.035 265)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="in" fill="oklch(0.72 0.16 162)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" fill="oklch(0.78 0.16 75)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Activity */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Across modules and AI insights</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/60">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={`mt-1 h-2 w-2 rounded-full ${a.tag === "AI" ? "bg-secondary" : "bg-primary"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.who}</span>
                      <Badge variant="outline" className="text-[10px]">{a.tag}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.what}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>System status</CardTitle>
            <CardDescription>Infrastructure & integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { name: "Database", status: "Operational" },
              { name: "Auth & RBAC", status: "Operational" },
              { name: "AI Gateway", status: "Operational" },
              { name: "Background jobs", status: "Operational" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{s.name}</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_162)]" />
                  <span className="text-xs">{s.status}</span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon, label, value, delta, up,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
        <div className={`mt-1 flex items-center gap-1 text-xs ${up ? "text-[oklch(0.72_0.16_162)]" : "text-destructive"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {delta} <span className="text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}


export default Dashboard;
