// @ts-nocheck

import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";

function SalesPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Sales" description="Quotations, sales orders and invoicing." />
      <div className="grid gap-6">
        <ResourceTable<SO>
          title="Sales Orders"
          table="sales_orders"
          columns={[
            { key: "order_number", label: "SO #" },
            { key: "order_date", label: "Date" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "total_amount", label: "Total", render: (r) => `$${Number(r.total_amount).toLocaleString()}` },
          ]}
          fields={[
            { name: "customer_id", label: "Customer UUID", placeholder: "paste a customer id" },
            { name: "order_date", label: "Order date", type: "date" },
            { name: "status", label: "Status", type: "select", defaultValue: "draft",
              options: [{label:"Draft",value:"draft"},{label:"Confirmed",value:"confirmed"},{label:"Shipped",value:"shipped"},{label:"Completed",value:"completed"},{label:"Cancelled",value:"cancelled"}]},
            { name: "total_amount", label: "Total ($)", type: "number", defaultValue: 0 },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
        <ResourceTable<Invoice>
          title="Invoices"
          description="Billing & payment tracking"
          table="invoices"
          columns={[
            { key: "invoice_number", label: "Invoice #" },
            { key: "amount", label: "Amount", render: (r) => `$${Number(r.amount).toLocaleString()}` },
            { key: "paid_amount", label: "Paid", render: (r) => `$${Number(r.paid_amount).toLocaleString()}` },
            { key: "due_date", label: "Due" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          fields={[
            { name: "customer_id", label: "Customer UUID" },
            { name: "amount", label: "Amount ($)", type: "number", required: true, defaultValue: 0 },
            { name: "paid_amount", label: "Paid ($)", type: "number", defaultValue: 0 },
            { name: "due_date", label: "Due date", type: "date" },
            { name: "status", label: "Status", type: "select", defaultValue: "unpaid",
              options: [{label:"Unpaid",value:"unpaid"},{label:"Partial",value:"partial"},{label:"Paid",value:"paid"},{label:"Overdue",value:"overdue"}]},
          ]}
        />
      </div>
    </div>
  );
}


export default SalesPage;
