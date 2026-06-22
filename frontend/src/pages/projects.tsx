
import { ResourceTable } from "@/components/resource-table";
import { PageHeader, StatusBadge } from "@/components/module-shell";

function ProjectsPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Projects" description="Projects, tasks, and timelines." />
      <div className="grid gap-6">
        <ResourceTable<Project>
          title="Projects"
          table="projects"
          columns={[
            { key: "name", label: "Name" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "start_date", label: "Start" },
            { key: "end_date", label: "End" },
            { key: "budget", label: "Budget", render: (r) => `$${Number(r.budget).toLocaleString()}` },
          ]}
          fields={[
            { name: "name", label: "Project name", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "status", label: "Status", type: "select", defaultValue: "planning",
              options: [{label:"Planning",value:"planning"},{label:"In progress",value:"in_progress"},{label:"On hold",value:"on_hold"},{label:"Completed",value:"completed"}]},
            { name: "start_date", label: "Start date", type: "date" },
            { name: "end_date", label: "End date", type: "date" },
            { name: "budget", label: "Budget ($)", type: "number", defaultValue: 0 },
          ]}
        />
        <ResourceTable<Task>
          title="Tasks"
          table="tasks"
          columns={[
            { key: "title", label: "Title" },
            { key: "priority", label: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "due_date", label: "Due" },
          ]}
          fields={[
            { name: "project_id", label: "Project UUID" },
            { name: "title", label: "Task title", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "status", label: "Status", type: "select", defaultValue: "todo",
              options: [{label:"To do",value:"todo"},{label:"In progress",value:"in_progress"},{label:"Review",value:"review"},{label:"Done",value:"done"}]},
            { name: "priority", label: "Priority", type: "select", defaultValue: "medium",
              options: [{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"},{label:"Critical",value:"critical"}]},
            { name: "due_date", label: "Due", type: "date" },
          ]}
        />
      </div>
    </div>
  );
}


export default ProjectsPage;
