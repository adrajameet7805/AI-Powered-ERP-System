import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowDownRight, ArrowUpRight, Boxes, DollarSign, TrendingUp, Users, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, roles } = useAuth();
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  const { data: kpis, isLoading: kpiLoading } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: async () => {
      try {
        return (await api.get('/dashboard/kpis')).data;
      } catch {
        return { total_revenue: 0, total_customers: 0,
                 total_products: 0, total_employees: 0,
                 revenue_change_pct: 0, customer_change_pct: 0 };
      }
    }
  });

  const { data: revenueData, isLoading: revLoading } = useQuery({
    queryKey: ['dashboard', 'revenue-chart'],
    queryFn: async () => {
      try {
        return (await api.get('/dashboard/revenue-chart')).data;
      } catch {
        return [];
      }
    }
  });

  const { data: inventoryData, isLoading: invLoading } = useQuery({
    queryKey: ['dashboard', 'inventory-chart'],
    queryFn: async () => {
      try {
        return (await api.get('/dashboard/inventory-chart')).data;
      } catch {
        return [];
      }
    }
  });

  const { data: activity, isLoading: actLoading } = useQuery({
    queryKey: ['dashboard', 'activity-feed'],
    queryFn: async () => {
      try {
        return (await api.get('/dashboard/activity-feed')).data;
      } catch {
        return [];
      }
    }
  });

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
        {kpiLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="glass overflow-hidden"><CardContent className="p-5 flex justify-center items-center h-[120px]"><Loader2 className="animate-spin text-muted-foreground" /></CardContent></Card>
          ))
        ) : (
          <>
            <Kpi icon={DollarSign} label="Revenue (MTD)" value={`$${kpis?.total_revenue?.toLocaleString()}`} delta={`${kpis?.revenue_change_pct > 0 ? '+' : ''}${kpis?.revenue_change_pct}%`} up={kpis?.revenue_change_pct >= 0} />
            <Kpi icon={TrendingUp} label="Total Products" value={`${kpis?.total_products}`} delta="Live" up />
            <Kpi icon={Boxes} label="Total Employees" value={`${kpis?.total_employees}`} delta="Active" up />
            <Kpi icon={Users} label="Active customers" value={`${kpis?.total_customers}`} delta={`${kpis?.customer_change_pct > 0 ? '+' : ''}${kpis?.customer_change_pct}%`} up={kpis?.customer_change_pct >= 0} />
          </>
        )}
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & profit</CardTitle>
            <CardDescription>Trailing 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {revLoading ? (
              <div className="h-full w-full flex justify-center items-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData || []}>
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
                  <XAxis dataKey="month" stroke="oklch(0.7 0.02 256)" fontSize={12} />
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
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Stock movement</CardTitle>
            <CardDescription>Last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {invLoading ? (
              <div className="h-full w-full flex justify-center items-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                  <XAxis dataKey="week" stroke="oklch(0.7 0.02 256)" fontSize={12} />
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
            )}
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
            {actLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : (
              <ul className="divide-y divide-border/60">
                {(activity || []).map((a: { tag: string; who: string; what: string; when: string }, i: number) => (
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
                {!(activity?.length) && <li className="py-4 text-sm text-muted-foreground">No recent activities found.</li>}
              </ul>
            )}
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
