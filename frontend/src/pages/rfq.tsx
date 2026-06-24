import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { PageHeader, StatPill, StatusBadge } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Eye, Send, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface RFQItem {
  id?: number;
  description: string;
  quantity: number;
  unit: string;
  estimated_price: number | null;
}

interface RFQ {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
  created_at: string;
  vendor_count: number;
  quotation_count: number;
  items: RFQItem[];
}

interface Supplier {
  id: number;
  name: string;
  email: string;
  location: string;
}

interface QuotationItem {
  id: number;
  rfq_item_description: string;
  unit_price: number;
  total_price: number;
  notes: string;
}

interface Quotation {
  id: number;
  rfq_id: number;
  vendor_id: number;
  vendor_name: string;
  total_price: number;
  delivery_days: number;
  valid_until: string;
  notes: string;
  status: string;
  submitted_at: string;
  items: QuotationItem[];
}

export default function RFQPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [quotesOpen, setQuotesOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [items, setItems] = useState<RFQItem[]>([
    { description: "", quantity: 1, unit: "units", estimated_price: 0 }
  ]);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);

  // Fetch RFQs
  const { data: rfqsData, isLoading } = useQuery({
    queryKey: ["rfqs"],
    queryFn: async () => {
      const { data } = await api.get("/rfqs", { params: { per_page: 1000 } });
      return data.data as RFQ[];
    }
  });

  // Fetch Suppliers
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data } = await api.get("/suppliers");
      return (Array.isArray(data) ? data : data.data) as Supplier[];
    }
  });

  // Fetch Quotations for selected RFQ
  const { data: quotations, isLoading: quotesLoading } = useQuery({
    queryKey: ["rfq_quotations", selectedRfq?.id],
    queryFn: async () => {
      if (!selectedRfq) return [];
      const { data } = await api.get(`/rfqs/${selectedRfq.id}/quotations`);
      return data as Quotation[];
    },
    enabled: !!selectedRfq
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/rfqs", payload);
    },
    onSuccess: () => {
      toast.success("RFQ created successfully");
      qc.invalidateQueries({ queryKey: ["rfqs"] });
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create RFQ");
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.put(`/rfqs/${id}`, { status: "published" });
    },
    onSuccess: () => {
      toast.success("RFQ published successfully");
      qc.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to publish RFQ");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/rfqs/${id}`);
    },
    onSuccess: () => {
      toast.success("RFQ deleted successfully");
      qc.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete RFQ");
    }
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setItems([{ description: "", quantity: 1, unit: "units", estimated_price: 0 }]);
    setSelectedVendors([]);
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unit: "units", estimated_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof RFQItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleVendorToggle = (vendorId: number) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline) {
      toast.error("Title and Deadline are required");
      return;
    }
    if (items.some(it => !it.description || it.quantity <= 0)) {
      toast.error("All items must have a description and quantity greater than 0");
      return;
    }
    createMutation.mutate({
      title,
      description,
      deadline,
      items,
      vendor_ids: selectedVendors,
      status: "draft"
    });
  };

  // Calculations for KPI
  const rfqList = rfqsData || [];
  const totalRfq = rfqList.length;
  const publishedRfq = rfqList.filter(r => r.status === "published").length;
  const closedRfq = rfqList.filter(r => r.status === "closed").length;
  const awardedRfq = rfqList.filter(r => r.status === "awarded").length;

  // Filtered RFQs
  const filteredRfqs = rfqList.filter(r => filter === "all" || r.status === filter);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title="RFQ Management"
        description="Create and manage Requests for Quotations for your vendors"
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90 transition-all duration-300"
          >
            <Plus className="mr-1 h-4 w-4" /> New RFQ
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatPill label="Total RFQs" value={String(totalRfq)} tone="default" />
        <StatPill label="Published" value={String(publishedRfq)} tone="success" />
        <StatPill label="Closed" value={String(closedRfq)} tone="warn" />
        <StatPill label="Awarded" value={String(awardedRfq)} tone="success" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-px">
        {["all", "draft", "published", "closed", "awarded"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-all duration-200 ${
              filter === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <Card className="glass">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              Loading RFQs...
            </div>
          ) : filteredRfqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-sm text-muted-foreground space-y-2">
              <ShieldAlert className="h-8 w-8 text-muted-foreground/60" />
              <span>No requests for quotation found.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Invited Vendors</TableHead>
                  <TableHead className="text-center">Quotes Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRfqs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="text-sm font-semibold">{rfq.title}</div>
                        {rfq.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-sm mt-0.5">
                            {rfq.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rfq.deadline}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rfq.status} />
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {rfq.vendor_count}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {rfq.quotation_count}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRfq(rfq);
                          setQuotesOpen(true);
                        }}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" /> View Quotes
                      </Button>
                      {rfq.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => publishMutation.mutate(rfq.id)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Send className="mr-1 h-3.5 w-3.5" /> Publish
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this RFQ?")) {
                            deleteMutation.mutate(rfq.id);
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

      {/* Create RFQ Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl glass max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Request for Quotation</DialogTitle>
            <DialogDescription>
              Submit a new RFQ and automatically invite selected suppliers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rfq-title">RFQ Title *</Label>
                <Input
                  id="rfq-title"
                  placeholder="e.g. Q3 Office Server Infrastructure Setup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfq-deadline">Deadline Date *</Label>
                <Input
                  id="rfq-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfq-desc">Detailed Description</Label>
              <Textarea
                id="rfq-desc"
                placeholder="Details of requirements, delivery constraints, quality specifications, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Dynamic Items List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <Label className="text-base font-semibold">RFQ Items List</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-8 border-dashed hover:bg-muted"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Item Row
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end bg-card/40 p-3 rounded-lg border border-border/40 relative">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Description *</Label>
                      <Input
                        placeholder="Item name / specifications"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs text-muted-foreground">Qty *</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs text-muted-foreground">Unit</Label>
                      <Input
                        placeholder="e.g. units, kg"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <Label className="text-xs text-muted-foreground">Est. Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Optional"
                        value={item.estimated_price || ""}
                        onChange={(e) => handleItemChange(index, "estimated_price", e.target.value ? Number(e.target.value) : null)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className="text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Selection List */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Invite Vendors (Select multi)</Label>
              <Card className="border border-border/40">
                <ScrollArea className="h-[150px] p-4">
                  <div className="space-y-3">
                    {suppliers?.map((supp) => (
                      <div key={supp.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`vendor-${supp.id}`}
                          checked={selectedVendors.includes(supp.id)}
                          onCheckedChange={() => handleVendorToggle(supp.id)}
                        />
                        <label
                          htmlFor={`vendor-${supp.id}`}
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-wrap justify-between w-full pr-4"
                        >
                          <span>{supp.name}</span>
                          <span className="text-xs text-muted-foreground">{supp.location} ({supp.email})</span>
                        </label>
                      </div>
                    ))}
                    {(!suppliers || suppliers.length === 0) && (
                      <div className="text-xs text-muted-foreground">No suppliers found in directory. Add them under Purchase module first.</div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Create RFQ (Draft)"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Quotations Sheet (Side Panel) */}
      <Sheet open={quotesOpen} onOpenChange={setQuotesOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto glass border-l border-border/50">
          <SheetHeader className="mb-6">
            <SheetTitle>Quotation Responses</SheetTitle>
            <SheetDescription>
              Quotations submitted by vendors for: <span className="font-semibold text-foreground">{selectedRfq?.title}</span>
            </SheetDescription>
          </SheetHeader>

          {quotesLoading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              Loading quotations...
            </div>
          ) : !quotations || quotations.length === 0 ? (
            <div className="text-sm text-muted-foreground p-6 text-center">
              No quotes submitted for this RFQ yet.
            </div>
          ) : (
            <div className="space-y-6">
              {quotations.map((quote) => (
                <Card key={quote.id} className="border border-border/40 bg-card/25 shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    {/* Quotation Header */}
                    <div className="flex items-start justify-between border-b border-border/40 pb-3">
                      <div>
                        <h4 className="font-bold text-base text-gradient">{quote.vendor_name}</h4>
                        <span className="text-xs text-muted-foreground">Submitted: {quote.submitted_at?.split(" ")[0]}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">₹{quote.total_price.toLocaleString("en-IN")}</div>
                        <StatusBadge status={quote.status} />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Delivery Lead Time</span>
                        <span className="font-semibold text-foreground">{quote.delivery_days} days</span>
                      </div>
                      {quote.valid_until && (
                        <div>
                          <span className="text-muted-foreground block">Quote Valid Until</span>
                          <span className="font-semibold text-foreground">{quote.valid_until}</span>
                        </div>
                      )}
                    </div>

                    {quote.notes && (
                      <div className="bg-muted/40 p-2.5 rounded text-xs text-muted-foreground italic border border-border/20">
                        <strong>Notes:</strong> {quote.notes}
                      </div>
                    )}

                    {/* Line Items */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Line Items Details</div>
                      <Table>
                        <TableHeader>
                          <TableRow className="h-8 hover:bg-transparent">
                            <TableHead className="h-8 text-xs">Description</TableHead>
                            <TableHead className="h-8 text-right text-xs">Unit Price</TableHead>
                            <TableHead className="h-8 text-right text-xs">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quote.items.map((qi) => (
                            <TableRow key={qi.id} className="hover:bg-transparent h-8">
                              <TableCell className="py-1.5 text-xs font-medium">{qi.rfq_item_description}</TableCell>
                              <TableCell className="py-1.5 text-right text-xs">₹{qi.unit_price.toLocaleString("en-IN")}</TableCell>
                              <TableCell className="py-1.5 text-right text-xs font-semibold">₹{qi.total_price.toLocaleString("en-IN")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
