import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { PageHeader } from "@/components/module-shell";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Clock, Check, ShieldAlert, Award, Star } from "lucide-react";
import { toast } from "sonner";

interface RFQItem {
  id: number;
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
  items: RFQItem[];
}

interface QuotationItem {
  id: number;
  rfq_item_id: number;
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
  items: QuotationItem[];
}

export default function QuotationComparePage() {
  const qc = useQueryClient();
  const [selectedRfqId, setSelectedRfqId] = useState<string>("");

  // Fetch RFQs list
  const { data: rfqs } = useQuery({
    queryKey: ["rfqs_for_compare"],
    queryFn: async () => {
      const { data } = await api.get("/rfqs", { params: { per_page: 1000 } });
      return data.data as RFQ[];
    }
  });

  // Fetch Quotations for selected RFQ
  const { data: quotations, isLoading: quotesLoading } = useQuery({
    queryKey: ["compare_quotations", selectedRfqId],
    queryFn: async () => {
      if (!selectedRfqId) return [];
      const { data } = await api.get(`/rfqs/${selectedRfqId}/quotations`);
      return data as Quotation[];
    },
    enabled: !!selectedRfqId
  });

  const selectedRfq = rfqs?.find(r => String(r.id) === selectedRfqId);

  // Mutation to Award Quote
  const selectMutation = useMutation({
    mutationFn: async (quoteId: number) => {
      const { data } = await api.patch(`/vendor-quotations/${quoteId}/select`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Quotation selected! Generated ${data.po_number || "Purchase Order"}`);
      qc.invalidateQueries({ queryKey: ["rfqs"] });
      qc.invalidateQueries({ queryKey: ["compare_quotations", selectedRfqId] });
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to select quotation");
    }
  });

  // Calculate comparisons
  const quotes = quotations || [];
  const hasQuotes = quotes.length > 0;

  // Find min price for each RFQItem
  const getCheapestQuoteForItem = (rfqItemId: number) => {
    if (quotes.length === 0) return null;
    let minPrice = Infinity;
    let minQuoteId = -1;

    quotes.forEach(q => {
      const item = q.items.find(i => i.rfq_item_id === rfqItemId);
      if (item && item.unit_price < minPrice) {
        minPrice = item.unit_price;
        minQuoteId = q.id;
      }
    });

    return minQuoteId;
  };

  // Find fastest delivery quote
  const getFastestDeliveryQuote = () => {
    if (quotes.length === 0) return -1;
    let minDays = Infinity;
    let minQuoteId = -1;

    quotes.forEach(q => {
      if (q.delivery_days < minDays) {
        minDays = q.delivery_days;
        minQuoteId = q.id;
      }
    });

    return minQuoteId;
  };

  // Find overall cheapest quote
  const getCheapestTotalQuote = () => {
    if (quotes.length === 0) return -1;
    let minTotal = Infinity;
    let minQuoteId = -1;

    quotes.forEach(q => {
      if (q.total_price < minTotal) {
        minTotal = q.total_price;
        minQuoteId = q.id;
      }
    });

    return minQuoteId;
  };

  const fastestQuoteId = getFastestDeliveryQuote();
  const cheapestTotalQuoteId = getCheapestTotalQuote();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Quotation Comparison"
        description="Compare vendor quotations side-by-side and auto-generate Purchase Orders"
      />

      {/* Select Box */}
      <Card className="glass">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Select Published RFQ</label>
            <Select value={selectedRfqId} onValueChange={setSelectedRfqId}>
              <SelectTrigger>
                <SelectValue placeholder="-- Select an RFQ --" />
              </SelectTrigger>
              <SelectContent>
                {rfqs?.filter(r => r.status !== "draft").map(r => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.title} ({r.status.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedRfq && (
            <div className="flex gap-6 text-xs bg-muted/20 border border-border/40 p-3.5 rounded-lg w-full md:w-auto">
              <div>
                <span className="text-muted-foreground block">Deadline</span>
                <span className="font-semibold text-foreground">{selectedRfq.deadline}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Status</span>
                <span className="font-semibold capitalize text-primary">{selectedRfq.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Quotations received</span>
                <span className="font-semibold text-foreground">{quotes.length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparisons */}
      {!selectedRfqId ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted-foreground text-sm space-y-2 border-2 border-dashed border-border/40 rounded-xl bg-card/20">
          <BarChart3 className="h-10 w-10 text-muted-foreground/60" />
          <span>Please select a Request for Quotation above to view comparison.</span>
        </div>
      ) : quotesLoading ? (
        <div className="text-center p-12 text-sm text-muted-foreground">Loading vendor responses...</div>
      ) : !hasQuotes ? (
        <Alert variant="destructive" className="glass border-destructive/30">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>No submissions yet</AlertTitle>
          <AlertDescription>
            No vendors have submitted quotations for this RFQ yet. Send invitations or await submissions.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {/* Main Side-by-Side Table Card */}
          <Card className="glass overflow-hidden shadow-xl">
            <CardHeader className="border-b border-border/40">
              <CardTitle>Comparison Sheet</CardTitle>
              <CardDescription>
                Compare vendor item rates, lead times, and terms side-by-side. 
                Cheapest items are highlighted in <span className="text-emerald-500 font-semibold">Green</span> and fastest delivery in <span className="text-blue-500 font-semibold">Blue</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[240px] font-semibold">RFQ Requested Item</TableHead>
                    {quotes.map(q => (
                      <TableHead key={q.id} className="min-w-[180px] text-center font-bold text-base text-gradient py-4">
                        {q.vendor_name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Line Items Rows */}
                  {selectedRfq?.items.map(rfqItem => {
                    const cheapestQuoteId = getCheapestQuoteForItem(rfqItem.id);
                    return (
                      <TableRow key={rfqItem.id}>
                        <TableCell>
                          <div className="font-semibold text-sm">{rfqItem.description}</div>
                          <div className="text-xs text-muted-foreground">Qty: {rfqItem.quantity} {rfqItem.unit}</div>
                        </TableCell>
                        {quotes.map(q => {
                          const quoteItem = q.items.find(i => i.rfq_item_id === rfqItem.id);
                          const isCheapest = q.id === cheapestQuoteId;
                          return (
                            <TableCell
                              key={q.id}
                              className={`text-center transition-all duration-200 ${
                                isCheapest
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                                  : ""
                              }`}
                            >
                              {quoteItem ? (
                                <div>
                                  <div className="text-sm font-semibold">₹{quoteItem.unit_price.toLocaleString("en-IN")} / {rfqItem.unit}</div>
                                  <div className="text-xs text-muted-foreground/80 mt-0.5">Total: ₹{quoteItem.total_price.toLocaleString("en-IN")}</div>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">No quote</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}

                  {/* Delivery Days Row */}
                  <TableRow className="border-t border-border/80">
                    <TableCell className="font-semibold text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        Delivery Days
                      </div>
                    </TableCell>
                    {quotes.map(q => {
                      const isFastest = q.id === fastestQuoteId;
                      return (
                        <TableCell
                          key={q.id}
                          className={`text-center font-medium ${
                            isFastest ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" : ""
                          }`}
                        >
                          {q.delivery_days} days
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Valid Until Row */}
                  <TableRow>
                    <TableCell className="font-semibold text-sm">Validity</TableCell>
                    {quotes.map(q => (
                      <TableCell key={q.id} className="text-center text-xs text-muted-foreground">
                        {q.valid_until || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Notes Row */}
                  <TableRow>
                    <TableCell className="font-semibold text-sm">Vendor Notes</TableCell>
                    {quotes.map(q => (
                      <TableCell key={q.id} className="text-center text-xs text-muted-foreground max-w-[180px] truncate italic" title={q.notes}>
                        {q.notes || "—"}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Overall Total Row */}
                  <TableRow className="border-t-2 border-border/60 bg-muted/20 font-bold">
                    <TableCell className="text-base font-bold">TOTAL BID VALUE</TableCell>
                    {quotes.map(q => {
                      const isCheapestTotal = q.id === cheapestTotalQuoteId;
                      return (
                        <TableCell
                          key={q.id}
                          className={`text-center text-lg ${
                            isCheapestTotal
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15"
                              : "text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 font-bold">
                            ₹{q.total_price.toLocaleString("en-IN")}
                            {isCheapestTotal && <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Actions / Select Buttons */}
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="border-b-0"></TableCell>
                    {quotes.map(q => {
                      const isSelected = q.status === "selected";
                      const isRejected = q.status === "rejected";
                      return (
                        <TableCell key={q.id} className="text-center py-6 border-b-0">
                          {isSelected ? (
                            <Button disabled className="w-full bg-emerald-600/80 text-background">
                              <Check className="mr-1 h-4 w-4" /> Awarded
                            </Button>
                          ) : isRejected ? (
                            <span className="text-xs text-muted-foreground capitalize font-medium">{q.status}</span>
                          ) : (
                            <Button
                              onClick={() => {
                                if (confirm(`Award this procurement contract to ${q.vendor_name}? This will reject other bids and automatically issue an approved Purchase Order.`)) {
                                  selectMutation.mutate(q.id);
                                }
                              }}
                              disabled={selectMutation.isPending || selectedRfq?.status === "awarded"}
                              className={`w-full ${
                                q.id === cheapestTotalQuoteId
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-background"
                                  : "bg-primary hover:opacity-90"
                              }`}
                            >
                              <Award className="mr-1 h-4 w-4 text-background" /> Award Contract
                            </Button>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
