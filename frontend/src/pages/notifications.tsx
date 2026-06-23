import { N } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import api from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/module-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function NotificationsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await api.get("/notifications");
      const resolved = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      return resolved as N[];
    },
    enabled: !!user,
  });

  const seed = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const rows = [
        { recipient_role: "Manager", title: "Leave request awaiting approval", message: "Marcus Lee · 3 days · Aug 12–14", type: "hr" },
        { recipient_role: "Admin", title: "Invoice INV-00421 overdue", message: "Atlas Logistics · $12,300 · 5 days late", type: "finance" },
        { recipient_role: "all", title: "System maintenance", message: "Scheduled downtime Saturday 2–4 AM", type: "info" },
      ];
      await api.post("/notifications", rows);
    },
    onSuccess: () => { toast.success("Demo notifications added"); qc.invalidateQueries({ queryKey: ["notifications"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const markRead = useMutation({
    mutationFn: async (id: string | number) => {
      await api.patch(`/notifications/${id}`, { read: true });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Notifications"
        description="Inventory alerts, approvals and reminders."
        action={<Button variant="outline" size="sm" onClick={() => seed.mutate()} disabled={seed.isPending}>Add demo notifications</Button>}
      />

      {isLoading && (
        <div className="grid place-items-center py-12"><Loader2 className="h-5 w-5 animate-spin" /></div>
      )}

      {!isLoading && (data?.length ?? 0) === 0 && (
        <Card className="glass"><CardContent className="py-16 text-center">
          <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">You're all caught up.</p>
        </CardContent></Card>
      )}

      <div className="space-y-3">
        {data?.map((n) => (
          <Card key={n.id} className={`glass ${n.read ? "opacity-60" : ""}`}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{n.type}</span>
                </div>
                {n.message && <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>}
                <span className="mt-1 block text-xs text-muted-foreground">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</span>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markRead.mutate(n.id)}>
                  <Check className="mr-1 h-3.5 w-3.5" /> Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
