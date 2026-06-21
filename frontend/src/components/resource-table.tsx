import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ModuleCard, AddButton } from "./module-shell";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "email";
  options?: { label: string; value: string }[];
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
};

export type ColumnDef<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
};

interface Props<T> {
  title: string;
  description?: string;
  table: string;
  columns: ColumnDef<T>[];
  fields: FieldDef[];
  orderBy?: string;
  orderAsc?: boolean;
  emptyMessage?: string;
}

export function ResourceTable<T extends { id: string }>({
  title, description, table, columns, fields,
  orderBy = "created_at", orderAsc = false, emptyMessage = "No records yet.",
}: Props<T>) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [table, orderBy, orderAsc],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/${table}?orderBy=${orderBy}&orderAsc=${orderAsc}`);
        return data as T[];
      } catch (e) {
        return [] as T[];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      await api.post(`/${table}`, values);
    },
    onSuccess: () => {
      toast.success("Record created");
      qc.invalidateQueries({ queryKey: [table] });
      setOpen(false);
    },
    onError: (e: any) => {
      const msg = e.response?.data?.error || e.message;
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/${table}/${id}`);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: any) => {
      const msg = e.response?.data?.error || e.message;
      toast.error(msg);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = fd.get(f.name);
      if (raw === null || raw === "") continue;
      if (f.type === "number") values[f.name] = Number(raw);
      else values[f.name] = raw;
    }
    createMutation.mutate(values);
  }

  return (
    <ModuleCard
      title={title}
      description={description}
      action={<AddButton onClick={() => setOpen(true)} />}
    >
      <div className="overflow-x-auto rounded-md border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((c) => (
                <TableHead key={c.key} className="text-xs uppercase tracking-wider">{c.label}</TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10 text-muted-foreground">
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              </TableCell></TableRow>
            )}
            {!isLoading && (data?.length ?? 0) === 0 && (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10 text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell></TableRow>
            )}
            {data?.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/20">
                {columns.map((c) => (
                  <TableCell key={c.key} className="text-sm">
                    {c.render ? c.render(row) : ((row as unknown as Record<string, unknown>)[c.key] as ReactNode) ?? "—"}
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(row.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New {title.toLowerCase()}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.name} name={f.name} required={f.required} placeholder={f.placeholder} />
                ) : f.type === "select" ? (
                  <Select name={f.name} defaultValue={f.defaultValue as string | undefined}>
                    <SelectTrigger><SelectValue placeholder={f.placeholder ?? "Select…"} /></SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.name} name={f.name} type={f.type ?? "text"}
                    required={f.required} placeholder={f.placeholder}
                    defaultValue={f.defaultValue}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ModuleCard>
  );
}
