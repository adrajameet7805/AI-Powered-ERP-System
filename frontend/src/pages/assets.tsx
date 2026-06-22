
import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";

function calcBookValue(a: Asset) {
  if (!a.purchase_date || !a.cost) return a.cost;
  const years = (Date.now() - new Date(a.purchase_date).getTime()) / (365.25 * 24 * 3600 * 1000);
  const dep = Math.min(Number(a.cost), Number(a.cost) * (Number(a.depreciation_rate) / 100) * years);
  return Math.max(0, Number(a.cost) - dep);
}

function AssetsPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Assets" description="Asset registry with depreciation tracking." />
      <ResourceTable<Asset>
        title="Asset Registry"
        table="assets"
        columns={[
          { key: "name", label: "Asset" },
          { key: "category", label: "Category" },
          { key: "location", label: "Location" },
          { key: "purchase_date", label: "Purchased" },
          { key: "cost", label: "Cost", render: (r) => `$${Number(r.cost).toLocaleString()}` },
          { key: "book", label: "Book value", render: (r) => `$${calcBookValue(r).toLocaleString(undefined,{maximumFractionDigits:0})}` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        fields={[
          { name: "name", label: "Asset name", required: true },
          { name: "category", label: "Category", placeholder: "Vehicle, IT, Office…" },
          { name: "location", label: "Location" },
          { name: "purchase_date", label: "Purchase date", type: "date" },
          { name: "cost", label: "Cost ($)", type: "number", defaultValue: 0 },
          { name: "depreciation_rate", label: "Depreciation rate (%/yr)", type: "number", defaultValue: 10 },
          { name: "status", label: "Status", type: "select", defaultValue: "in_use",
            options: [{label:"In use",value:"in_use"},{label:"Maintenance",value:"maintenance"},{label:"Retired",value:"retired"}]},
        ]}
      />
    </div>
  );
}


export default AssetsPage;
