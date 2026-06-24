import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { PageHeader } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, User, Calendar, RefreshCw } from "lucide-react";

interface LogEntry {
  id: number;
  actor_email: string;
  entity_type: string;
  entity_id: number;
  action: string;
  metadata: string | null;
  created_at: string;
}

export default function ActivityLogPage() {
  const [entityType, setEntityType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 15;

  // Fetch logs with increasing per_page for simple load more paging
  const { data: logsData, isLoading, isFetching } = useQuery({
    queryKey: ["activity_logs", entityType, page],
    queryFn: async () => {
      const { data } = await api.get("/activity-logs", {
        params: {
          page: 1,
          per_page: page * perPage,
          entity_type: entityType === "all" ? "" : entityType
        }
      });
      return data as { data: LogEntry[]; total: number; pages: number };
    }
  });

  const logs = logsData?.data || [];
  const total = logsData?.total || 0;
  const hasMore = logs.length < total;

  // Format relative time helper
  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return "";
    const tStr = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
    const date = new Date(tStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (isNaN(date.getTime())) return dateStr;

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) {
      if (diffHours === 1) return "1 hour ago";
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleFilterChange = (type: string) => {
    setEntityType(type);
    setPage(1); // Reset page size on filter change
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Activity Log"
        description="Comprehensive audit trail and timeline of all system transactions"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-px">
        {[
          { label: "All Logs", value: "all" },
          { label: "RFQs", value: "RFQ" },
          { label: "Quotations", value: "VendorQuotation" },
          { label: "GST Invoices", value: "GSTInvoice" },
          { label: "Purchase Orders", value: "PurchaseOrder" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              entityType === tab.value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline view */}
      <div className="relative max-w-2xl mx-auto py-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/40" />

        {isLoading ? (
          <div className="text-center p-12 text-sm text-muted-foreground">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm space-y-2 pl-12">
            <Activity className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <span>No logged actions found for this filter.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => {
              // Map colors to entity types
              const typeColorMap: Record<string, string> = {
                RFQ: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                VendorQuotation: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                GSTInvoice: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                PurchaseOrder: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
              };
              const badgeClass = typeColorMap[log.entity_type] || "bg-muted text-muted-foreground border-border";

              return (
                <div key={log.id} className="relative pl-14 group">
                  {/* Circle Indicator */}
                  <div className="absolute left-3.5 top-1.5 h-5 w-5 rounded-full bg-background border-2 border-primary/70 flex items-center justify-center shadow-sm z-10 transition-transform duration-300 group-hover:scale-110">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>

                  {/* Card Content */}
                  <Card className="glass group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      {/* Top row */}
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span className="font-semibold text-foreground">{log.actor_email || "System"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>{formatRelativeTime(log.created_at)}</span>
                        </div>
                      </div>

                      {/* Action text */}
                      <div className="text-sm font-medium text-foreground pr-2">
                        {log.action}
                      </div>

                      {/* Badge detail */}
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold ${badgeClass}`}>
                          {log.entity_type.replace(/([A-Z])/g, ' $1').trim()} #{log.entity_id}
                        </Badge>
                        
                        {log.metadata && log.metadata !== "None" && (
                          <span className="text-[10px] text-muted-foreground truncate max-w-xs font-mono bg-muted/30 px-1 rounded">
                            {log.metadata}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6 pl-14">
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isFetching}
                  variant="outline"
                  className="glass border-border/40 hover:bg-muted/40 transition-all duration-200"
                >
                  {isFetching ? (
                    <>
                      <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                      Loading logs...
                    </>
                  ) : (
                    "Load More Actions"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
