import { useQuery } from "@tanstack/react-query";
import { Product, Account, Employee } from "@/types";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { Download } from "lucide-react";

import api from "@/services/api";
import { PageHeader } from "@/components/module-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["oklch(0.82 0.13 210)","oklch(0.72 0.15 295)","oklch(0.72 0.16 162)","oklch(0.78 0.16 75)","oklch(0.66 0.22 27)"];

function ReportsPage() {
  const { data: products } = useQuery({
    queryKey: ["report-products"],
    queryFn: async () => {
      const res = await api.get('/inventory/products');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });
  const { data: accounts } = useQuery({
    queryKey: ["report-accounts"],
    queryFn: async () => {
      const res = await api.get('/accounts');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });
  const { data: employees } = useQuery({
    queryKey: ["report-employees"],
    queryFn: async () => {
      const res = await api.get('/employees');
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });

  let inventoryByCategory: { name: string; value: number }[] = [];
  let balanceByType: { name: string; value: number }[] = [];
  let headcountByDept: { name: string; headcount: number; payroll: number }[] = [];

  try {
    inventoryByCategory = Object.entries(
      (products ?? []).reduce((acc: Record<string, number>, p: Product) => {
        const k = p.category ?? "Uncategorized";
        acc[k] = (acc[k] ?? 0) + Number(p.current_stock) * Number(p.unit_price);
        return acc;
      }, {} as Record<string, number>),
    ).map(([name, value]) => ({ name, value: Math.round(value as number) }));

    balanceByType = Object.entries(
      (accounts ?? []).reduce((acc: Record<string, number>, a: Account) => {
        acc[a.account_type] = (acc[a.account_type] ?? 0) + Number(a.balance);
        return acc;
      }, {} as Record<string, number>),
    ).map(([name, value]) => ({ name, value: value as number }));

    headcountByDept = Object.entries(
      (employees ?? []).reduce((acc: Record<string, { count: number; payroll: number }>, e: Employee) => {
        const k = e.department ?? "Other";
        acc[k] = acc[k] ?? { count: 0, payroll: 0 };
        acc[k].count += 1;
        acc[k].payroll += Number(e.salary);
        return acc;
      }, {} as Record<string, { count: number; payroll: number }>),
    ).map(([name, v]) => {
      const typed = v as { count: number; payroll: number };
      return { name, headcount: typed.count, payroll: typed.payroll };
    });
  } catch (error) {
    console.error("Error calculating report metrics:", error);
  }

  function downloadCSV(rows: Record<string, unknown>[], filename: string) {
    if (!rows.length) return toast.info("No data to export");
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Reports & Analytics"
        description="Cross-module insights, exportable to CSV."
        action={
          <Button variant="outline" size="sm" onClick={() => downloadCSV(inventoryByCategory, "inventory-by-category.csv")}>
            <Download className="mr-1 h-4 w-4" /> Export inventory
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Inventory value by category</CardTitle>
            <CardDescription>Current stock × unit price</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={inventoryByCategory} dataKey="value" nameKey="name" outerRadius={100} label>
                  {inventoryByCategory.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Balance by account type</CardTitle>
            <CardDescription>Aggregate ledger position</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="oklch(0.82 0.13 210)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Headcount & payroll by department</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountByDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.7 0.02 256)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.035 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="headcount" fill="oklch(0.72 0.15 295)" radius={[4,4,0,0]} />
                <Bar dataKey="payroll" fill="oklch(0.82 0.13 210)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default ReportsPage;
