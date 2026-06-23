import { useState, useEffect, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [editRow, setEditRow] = useState<T | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: responseData, isLoading } = useQuery({
    queryKey: [table, orderBy, orderAsc, page, debouncedSearch],
    queryFn: async () => {
      try {
        const res = await api.get(`/${table}?orderBy=${orderBy}&orderAsc=${orderAsc}&page=${page}&per_page=50&search=${encodeURIComponent(debouncedSearch)}`);
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
      } catch (e) {
        return null;
      }
    },
  });

  // Handle both paginated and non-paginated (e.g. products) endpoints for safety during migration
  const isPaginated = responseData && !Array.isArray(responseData);
  const rows = (isPaginated ? (responseData as any).data : (responseData || [])) as T[];
  const totalPages = isPaginated ? (responseData as any).pages : 1;

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

  const updateMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      await api.put(`/${table}/${values.id}`, values);
    },
    onSuccess: () => {
      toast.success("Record updated");
      qc.invalidateQueries({ queryKey: [table] });
      setEditOpen(false);
      setEditRow(null);
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
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search ${title.toLowerCase()}...`}
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
            {!isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-10 text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell></TableRow>
            )}
            {(Array.isArray(rows) ? rows : []).map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/20">
                {columns.map((c) => (
                  <TableCell key={c.key} className="text-sm">
                    {c.render ? c.render(row) : ((row as unknown as Record<string, unknown>)[c.key] as ReactNode) ?? "—"}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditRow(row); setEditOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(row.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isPaginated && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
            <DialogDescription>Update the details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const values: Record<string, unknown> = { id: editRow?.id };
            for (const f of fields) {
              const raw = fd.get(f.name);
              if (raw === null || raw === "") continue;
              if (f.type === "number") values[f.name] = Number(raw);
              else values[f.name] = raw;
            }
            updateMutation.mutate(values);
          }} className="space-y-3">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={`edit-${f.name}`}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={`edit-${f.name}`} name={f.name} required={f.required} placeholder={f.placeholder} defaultValue={(editRow as any)?.[f.name]} />
                ) : f.type === "select" ? (
                  <Select name={f.name} defaultValue={(editRow as any)?.[f.name]}>
                    <SelectTrigger><SelectValue placeholder={f.placeholder ?? "Select…"} /></SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`edit-${f.name}`} name={f.name} type={f.type ?? "text"}
                    required={f.required} placeholder={f.placeholder}
                    defaultValue={(editRow as any)?.[f.name]}
                  />
                )}
              </div>
            ))}
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ModuleCard>
  );
}
