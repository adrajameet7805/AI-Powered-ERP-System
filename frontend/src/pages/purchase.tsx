// @ts-nocheck

import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";

function PurchasePage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Purchase" description="Suppliers, purchase orders, and procurement." />
      <div className="grid gap-6">
        <ResourceTable<Supplier>
          title="Suppliers"
          table="suppliers"
          columns={[
            { key: "name", label: "Supplier" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "rating", label: "Rating", render: (r) => `★ ${Number(r.rating).toFixed(1)}` },
          ]}
          fields={[
            { name: "name", label: "Supplier name", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone" },
            { name: "address", label: "Address" },
            { name: "rating", label: "Rating (0-5)", type: "number", defaultValue: 4 },
          ]}
        />
        <ResourceTable<PO>
          title="Purchase Orders"
          description="Procurement pipeline"
          table="purchase_orders"
          columns={[
            { key: "po_number", label: "PO #" },
            { key: "order_date", label: "Date" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "total_amount", label: "Total", render: (r) => `$${Number(r.total_amount).toLocaleString()}` },
          ]}
          fields={[
            { name: "supplier_id", label: "Supplier UUID" },
            { name: "order_date", label: "Order date", type: "date" },
            { name: "status", label: "Status", type: "select", defaultValue: "draft",
              options: [{label:"Draft",value:"draft"},{label:"Sent",value:"sent"},{label:"Received",value:"received"},{label:"Completed",value:"completed"}]},
            { name: "total_amount", label: "Total ($)", type: "number", defaultValue: 0 },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}


export default PurchasePage;
