// @ts-nocheck

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Boxes, PackageCheck, TrendingDown } from "lucide-react";

import api from "@/services/api";
import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatPill, StatusBadge } from "@/components/module-shell";

function InventoryPage() {
  const { data: products } = useQuery({
    queryKey: ["products-summary"],
    queryFn: async () => {
      const { data, error } = await api.get(`/${"products"}`);
      if (error) throw error;
      return data;
    },
  });

  const total = products?.length ?? 0;
  const lowStock = products?.filter((p) => p.current_stock <= p.reorder_level).length ?? 0;
  const totalUnits = products?.reduce((s, p) => s + p.current_stock, 0) ?? 0;
  const overstock = products?.filter((p) => p.current_stock > p.reorder_level * 8).length ?? 0;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Inventory" description="Products, warehouses, and stock movements." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Total SKUs" value={String(total)} />
        <StatPill label="Units in stock" value={totalUnits.toLocaleString()} />
        <StatPill label="Low stock" value={String(lowStock)} tone={lowStock > 0 ? "warn" : "success"} />
        <StatPill label="Overstock risks" value={String(overstock)} tone={overstock > 0 ? "danger" : "success"} />
      </div>

      <div className="grid gap-6">
        <ResourceTable<Product>
          title="Products"
          description="Catalog with live stock levels"
          table="products"
          columns={[
            { key: "sku", label: "SKU" },
            { key: "name", label: "Product" },
            { key: "category", label: "Category" },
            { key: "current_stock", label: "Stock", render: (r) => {
              const low = r.current_stock <= r.reorder_level;
              return (
                <span className={low ? "inline-flex items-center gap-1 text-[oklch(0.88_0.16_75)] font-medium" : ""}>
                  {low && <AlertTriangle className="h-3.5 w-3.5" />} {r.current_stock}
                </span>
              );
            }},
            { key: "reorder_level", label: "Reorder" },
            { key: "unit_price", label: "Price", render: (r) => `$${Number(r.unit_price).toFixed(2)}` },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          fields={[
            { name: "sku", label: "SKU", required: true, placeholder: "SKU-X1234" },
            { name: "name", label: "Product name", required: true },
            { name: "category", label: "Category" },
            { name: "unit_price", label: "Unit price ($)", type: "number", defaultValue: 0 },
            { name: "cost_price", label: "Cost price ($)", type: "number", defaultValue: 0 },
            { name: "reorder_level", label: "Reorder level", type: "number", defaultValue: 10 },
            { name: "current_stock", label: "Opening stock", type: "number", defaultValue: 0 },
          ]}
        />

        <ResourceTable<Warehouse>
          title="Warehouses"
          description="Storage locations"
          table="warehouses"
          columns={[
            { key: "name", label: "Name" },
            { key: "location", label: "Location" },
          ]}
          fields={[
            { name: "name", label: "Warehouse name", required: true },
            { name: "location", label: "Location" },
          ]}
        />

        <ResourceTable<Movement>
          title="Stock Movements"
          description="Receipts, issues and adjustments — stock updates automatically"
          table="stock_movements"
          columns={[
            { key: "created_at", label: "When", render: (r) => new Date(r.created_at).toLocaleDateString() },
            { key: "movement_type", label: "Type", render: (r) => <StatusBadge status={r.movement_type} /> },
            { key: "quantity", label: "Qty" },
            { key: "reference", label: "Reference" },
          ]}
          fields={[
            { name: "product_id", label: "Product UUID", required: true, placeholder: "paste a product id" },
            { name: "movement_type", label: "Type", type: "select", required: true, defaultValue: "in",
              options: [{label:"In (receipt)",value:"in"},{label:"Out (issue)",value:"out"},{label:"Adjust",value:"adjust"}]},
            { name: "quantity", label: "Quantity", type: "number", required: true, defaultValue: 1 },
            { name: "reference", label: "Reference", placeholder: "PO-1042 / SO-0381" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}


export default InventoryPage;
