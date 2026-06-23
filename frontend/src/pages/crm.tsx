import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";
import { Customer, Lead } from "@/types";

function CRMPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="CRM" description="Customers, leads, and sales pipeline." />
      <div className="grid gap-6">
        <ResourceTable<Customer>
          title="Customers"
          description="Active customer database"
          table="customers"
          columns={[
            { key: "name", label: "Name" },
            { key: "company", label: "Company" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status || "active"} /> },
          ]}
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "company", label: "Company" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone" },
            { name: "status", label: "Status", type: "select", defaultValue: "active",
              options: [{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}] },
          ]}
        />
        <ResourceTable<Lead>
          title="Leads & Pipeline"
          description="Open opportunities"
          table="leads"
          columns={[
            { key: "name", label: "Lead" },
            { key: "email", label: "Email" },
            { key: "source", label: "Source" },
            { key: "stage", label: "Stage", render: (r) => <StatusBadge status={r.stage} /> },
            { key: "value", label: "Value", render: (r) => `$${Number(r.value).toLocaleString()}` },
          ]}
          fields={[
            { name: "name", label: "Lead name", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "source", label: "Source", placeholder: "Website, Referral…" },
            { name: "stage", label: "Stage", type: "select", defaultValue: "new",
              options: [
                {label:"New",value:"new"},{label:"Qualified",value:"qualified"},
                {label:"Proposal",value:"proposal"},{label:"Negotiation",value:"negotiation"},
                {label:"Won",value:"won"},{label:"Lost",value:"lost"},
              ]},
            { name: "value", label: "Deal value ($)", type: "number", defaultValue: 0 },
          ]}
        />
      </div>
    </div>
  );
}


export default CRMPage;
