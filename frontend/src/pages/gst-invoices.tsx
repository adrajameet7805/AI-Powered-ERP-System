import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { PageHeader, StatPill, StatusBadge } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Check, ShieldAlert, Receipt } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface GSTInvoice {
  id: number;
  po_id: number;
  invoice_number: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_name: string;
  total_amount: number;
}

export default function GSTInvoicesPage() {
  const { roles } = useAuth();
  const isAdmin = roles[0] === "Admin";
  const qc = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<GSTInvoice | null>(null);
  
  // Form State
  const [poId, setPoId] = useState("");
  const [subtotalStr, setSubtotalStr] = useState("");
  const [isInterstate, setIsInterstate] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("draft");

  // Fetch Invoices
  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ["gst_invoices"],
    queryFn: async () => {
      const { data } = await api.get("/gst-invoices", { params: { per_page: 1000 } });
      return data.data as GSTInvoice[];
    }
  });

  // Fetch POs
  const { data: purchaseOrders } = useQuery({
    queryKey: ["purchase_orders"],
    queryFn: async () => {
      const { data } = await api.get("/purchase_orders");
      return (Array.isArray(data) ? data : data.data) as PurchaseOrder[];
    }
  });

  // Calculations
  const subtotal = parseFloat(subtotalStr) || 0;
  const cgst = isInterstate ? 0 : Math.round(subtotal * 0.09 * 100) / 100;
  const sgst = isInterstate ? 0 : Math.round(subtotal * 0.09 * 100) / 100;
  const igst = isInterstate ? Math.round(subtotal * 0.18 * 100) / 100 : 0;
  const totalAmount = subtotal + cgst + sgst + igst;

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/gst-invoices", payload);
    },
    onSuccess: () => {
      toast.success("GST Invoice created successfully");
      qc.invalidateQueries({ queryKey: ["gst_invoices"] });
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create invoice");
    }
  });

  const payMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.patch(`/gst-invoices/${id}/pay`);
    },
    onSuccess: () => {
      toast.success("Invoice marked as PAID");
      qc.invalidateQueries({ queryKey: ["gst_invoices"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to record payment");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/gst-invoices/${id}`);
    },
    onSuccess: () => {
      toast.success("Invoice deleted");
      qc.invalidateQueries({ queryKey: ["gst_invoices"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete invoice");
    }
  });

  const resetForm = () => {
    setPoId("");
    setSubtotalStr("");
    setIsInterstate(false);
    setDueDate("");
    setInvoiceStatus("draft");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poId || !subtotalStr || !dueDate) {
      toast.error("All fields are required");
      return;
    }
    createMutation.mutate({
      po_id: parseInt(poId),
      subtotal,
      is_interstate: isInterstate,
      due_date: dueDate,
      status: invoiceStatus
    });
  };

  // KPIs
  const invoiceList = invoicesData || [];
  const totalInvs = invoiceList.length;
  const paidInvs = invoiceList.filter(i => i.status === "paid").length;
  const pendingInvs = invoiceList.filter(i => ["draft", "sent", "acknowledged"].includes(i.status)).length;
  
  // Calculate overdue: due_date < today and not paid
  const todayStr = new Date().toISOString().split("T")[0];
  const overdueInvs = invoiceList.filter(i => i.status !== "paid" && i.due_date && i.due_date < todayStr).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title="GST Invoices"
        description="Track purchase invoices and automated tax distributions"
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90 transition-all duration-300"
          >
            <Plus className="mr-1 h-4 w-4" /> Create Invoice
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatPill label="Total Invoices" value={String(totalInvs)} tone="default" />
        <StatPill label="Paid" value={String(paidInvs)} tone="success" />
        <StatPill label="Pending" value={String(pendingInvs)} tone="warn" />
        <StatPill label="Overdue" value={String(overdueInvs)} tone="danger" />
      </div>

      {/* Table */}
      <Card className="glass">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              Loading invoices...
            </div>
          ) : invoiceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-sm text-muted-foreground space-y-2">
              <ShieldAlert className="h-8 w-8 text-muted-foreground/60" />
              <span>No GST Invoices found.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">CGST (9%)</TableHead>
                  <TableHead className="text-right">SGST (9%)</TableHead>
                  <TableHead className="text-right">IGST (18%)</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceList.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-semibold text-sm">{inv.invoice_number}</TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground">
                      PO-{String(inv.po_id).padStart(4, "0")}
                    </TableCell>
                    <TableCell className="text-right">₹{inv.subtotal.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {inv.cgst > 0 ? `₹${inv.cgst.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {inv.sgst > 0 ? `₹${inv.sgst.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {inv.igst > 0 ? `₹${inv.igst.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      ₹{inv.total_amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.due_date || "—"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewInvoice(inv)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {inv.status !== "paid" && isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Confirm payment details for this invoice?")) {
                              payMutation.mutate(inv.id);
                            }
                          }}
                          className="hover:bg-emerald-500/10 hover:text-emerald-500"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" /> Mark Paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Delete this GST Invoice?")) {
                            deleteMutation.mutate(inv.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Invoice Form Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md glass">
          <DialogHeader>
            <DialogTitle>Create GST Invoice</DialogTitle>
            <DialogDescription>
              Assign to a PO, set subtotal, toggle interstate state and generate tax breakdowns.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label>Select Purchase Order *</Label>
              <Select value={poId} onValueChange={setPoId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select PO --" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders?.map(po => (
                    <SelectItem key={po.id} value={String(po.id)}>
                      PO-{String(po.id).padStart(4, "0")} ({po.supplier_name || "Supplier"}) - ₹{po.total_amount?.toLocaleString("en-IN")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subtotal">Subtotal Amount (₹) *</Label>
              <Input
                id="subtotal"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="100000"
                value={subtotalStr}
                onChange={(e) => setSubtotalStr(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/40">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Interstate Transaction?</Label>
                <span className="text-xs text-muted-foreground block">
                  {isInterstate ? "Applies 18% IGST" : "Applies 9% CGST + 9% SGST"}
                </span>
              </div>
              <Switch checked={isInterstate} onCheckedChange={setIsInterstate} />
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-card/65 p-4 rounded-lg border border-border/40 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {!isInterstate ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGST (9%):</span>
                    <span className="font-semibold">₹{cgst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST (9%):</span>
                    <span className="font-semibold">₹{sgst.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IGST (18%):</span>
                  <span className="font-semibold">₹{igst.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/40 pt-2 text-sm font-bold text-primary">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="due-date">Due Date *</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={invoiceStatus} onValueChange={setInvoiceStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Save Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={(open) => !open && setViewInvoice(null)}>
        {viewInvoice && (
          <DialogContent className="max-w-md glass">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary">
                <Receipt className="h-5 w-5" />
                <DialogTitle>GST Tax Invoice</DialogTitle>
              </div>
              <DialogDescription>
                System generated official tax invoice details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 border-t border-b border-border/40 my-2">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Invoice Number</span>
                  <span className="font-semibold text-foreground text-sm">{viewInvoice.invoice_number}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">PO Reference</span>
                  <span className="font-semibold text-foreground text-sm">PO-{String(viewInvoice.po_id).padStart(4, "0")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Date Generated</span>
                  <span className="font-semibold text-foreground">{viewInvoice.created_at.split(" ")[0]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status</span>
                  <span className="inline-block mt-0.5"><StatusBadge status={viewInvoice.status} /></span>
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="bg-muted/30 p-4 rounded-lg border border-border/20 text-xs space-y-3">
                <div className="flex justify-between border-b border-border/40 pb-2 font-semibold">
                  <span>Particulars</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>₹{viewInvoice.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {viewInvoice.cgst > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST (9%):</span>
                    <span>₹{viewInvoice.cgst.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {viewInvoice.sgst > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST (9%):</span>
                    <span>₹{viewInvoice.sgst.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {viewInvoice.igst > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>IGST (18%):</span>
                    <span>₹{viewInvoice.igst.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-primary border-t border-border/40 pt-2">
                  <span>Grand Total:</span>
                  <span>₹{viewInvoice.total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {viewInvoice.status === "paid" && viewInvoice.paid_at && (
                <div className="text-center text-xs text-emerald-500 font-semibold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/25">
                  Paid at: {viewInvoice.paid_at}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setViewInvoice(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
