import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { PageHeader, StatPill, StatusBadge } from "@/components/module-shell";
import { ResourceTable } from "@/components/resource-table";
import { Account, Txn, Expense } from "@/types";

function AccountingPage() {
  const { data: accounts } = useQuery({
    queryKey: ["accounts-totals"],
    queryFn: async () => {
      const { data } = await api.get(`/${"accounts"}`);
      return data;
    },
  });

  const sum = (t: string) => accounts?.filter((a: any) => a.account_type === t).reduce((s: number, a: any) => s + Number(a.balance), 0) ?? 0;
  const assets = sum("asset"), liab = sum("liability"), eq = sum("equity"), rev = sum("revenue"), exp = sum("expense");
  const profit = rev - exp;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Accounting" description="General ledger, AR/AP, expenses and reports." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Total assets" value={`$${assets.toLocaleString()}`} />
        <StatPill label="Liabilities" value={`$${liab.toLocaleString()}`} />
        <StatPill label="Equity" value={`$${eq.toLocaleString()}`} />
        <StatPill label="Revenue" value={`$${rev.toLocaleString()}`} tone="success" />
        <StatPill label="Net profit" value={`$${profit.toLocaleString()}`} tone={profit >= 0 ? "success" : "danger"} />
      </div>

      <div className="grid gap-6">
        <ResourceTable<Account>
          title="Chart of Accounts"
          table="accounts"
          columns={[
            { key: "name", label: "Account" },
            { key: "account_type", label: "Type", render: (r) => <StatusBadge status={r.account_type} /> },
            { key: "balance", label: "Balance", render: (r) => `$${Number(r.balance).toLocaleString()}` },
          ]}
          fields={[
            { name: "name", label: "Account name", required: true },
            { name: "account_type", label: "Type", type: "select", required: true, defaultValue: "asset",
              options: [{label:"Asset",value:"asset"},{label:"Liability",value:"liability"},{label:"Equity",value:"equity"},{label:"Revenue",value:"revenue"},{label:"Expense",value:"expense"}]},
            { name: "balance", label: "Opening balance ($)", type: "number", defaultValue: 0 },
          ]}
        />
        <ResourceTable<Txn>
          title="Transactions (Ledger)"
          table="transactions"
          columns={[
            { key: "txn_date", label: "Date" },
            { key: "txn_type", label: "Type", render: (r) => <StatusBadge status={r.txn_type} /> },
            { key: "amount", label: "Amount", render: (r) => `$${Number(r.amount).toLocaleString()}` },
            { key: "reference", label: "Reference" },
            { key: "description", label: "Description" },
          ]}
          fields={[
            { name: "account_id", label: "Account UUID" },
            { name: "txn_type", label: "Type", type: "select", required: true, defaultValue: "debit",
              options: [{label:"Debit",value:"debit"},{label:"Credit",value:"credit"}]},
            { name: "amount", label: "Amount ($)", type: "number", required: true },
            { name: "reference", label: "Reference" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "txn_date", label: "Date", type: "date" },
          ]}
        />
        <ResourceTable<Expense>
          title="Expenses"
          table="expenses"
          columns={[
            { key: "expense_date", label: "Date" },
            { key: "category", label: "Category" },
            { key: "amount", label: "Amount", render: (r) => `$${Number(r.amount).toLocaleString()}` },
            { key: "description", label: "Description" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          fields={[
            { name: "category", label: "Category", required: true, placeholder: "Travel, Software…" },
            { name: "amount", label: "Amount ($)", type: "number", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "expense_date", label: "Date", type: "date" },
            { name: "status", label: "Status", type: "select", defaultValue: "pending",
              options: [{label:"Pending",value:"pending"},{label:"Approved",value:"approved"},{label:"Reimbursed",value:"reimbursed"},{label:"Rejected",value:"rejected"}]},
          ]}
        />
      </div>
    </div>
  );
}


export default AccountingPage;
