// @ts-nocheck

import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";

function HRPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Human Resources" description="Employees, attendance, leave and payroll." />
      <div className="grid gap-6">
        <ResourceTable<Emp>
          title="Employees"
          table="employees"
          columns={[
            { key: "employee_code", label: "Code" },
            { key: "full_name", label: "Name" },
            { key: "department", label: "Department" },
            { key: "position", label: "Position" },
            { key: "salary", label: "Salary", render: (r) => `$${Number(r.salary).toLocaleString()}` },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          fields={[
            { name: "employee_code", label: "Employee code", required: true, placeholder: "EMP-006" },
            { name: "full_name", label: "Full name", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "department", label: "Department" },
            { name: "position", label: "Position" },
            { name: "hire_date", label: "Hire date", type: "date" },
            { name: "salary", label: "Annual salary ($)", type: "number", defaultValue: 0 },
          ]}
        />
        <ResourceTable<Att>
          title="Attendance"
          table="attendance"
          columns={[
            { key: "attendance_date", label: "Date" },
            { key: "check_in", label: "In" },
            { key: "check_out", label: "Out" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
          fields={[
            { name: "employee_id", label: "Employee UUID" },
            { name: "attendance_date", label: "Date", type: "date" },
            { name: "check_in", label: "Check-in (HH:MM)", placeholder: "09:00" },
            { name: "check_out", label: "Check-out (HH:MM)", placeholder: "17:30" },
            { name: "status", label: "Status", type: "select", defaultValue: "present",
              options: [{label:"Present",value:"present"},{label:"Absent",value:"absent"},{label:"Half-day",value:"half_day"},{label:"Leave",value:"leave"}]},
          ]}
        />
        <ResourceTable<Leave>
          title="Leave Requests"
          table="leave_requests"
          columns={[
            { key: "leave_type", label: "Type" },
            { key: "start_date", label: "From" },
            { key: "end_date", label: "To" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "reason", label: "Reason" },
          ]}
          fields={[
            { name: "employee_id", label: "Employee UUID" },
            { name: "leave_type", label: "Type", required: true, placeholder: "Vacation, Sick…" },
            { name: "start_date", label: "From", type: "date", required: true },
            { name: "end_date", label: "To", type: "date", required: true },
            { name: "reason", label: "Reason", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}


export default HRPage;
