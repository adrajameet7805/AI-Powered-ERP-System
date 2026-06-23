
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";

import api from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function UsersPage() {
  const { user, roles } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["profiles-with-roles"],
    queryFn: async () => {
      const res = await api.get("/auth/users");
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Users & Roles" description="Workspace members and their RBAC roles." />

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Your access</CardTitle>
          <CardDescription>Current session</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Email:</span> {user?.email}</div>
          <div><span className="text-muted-foreground">User ID:</span> <span className="font-mono text-xs">{user?.id}</span></div>
          <div className="sm:col-span-2">
            <span className="text-muted-foreground">Roles:</span>{" "}
            {roles.length > 0 ? roles.map((r) => <Badge key={r} variant="outline" className="ml-1">{r}</Badge>)
              : <span className="text-muted-foreground">none</span>}
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
          <CardDescription>Role changes are restricted to super_admin via secure RPC.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center"><Loader2 className="mx-auto h-4 w-4 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((p: { id: string; full_name: string; email: string; roles: string[]; created_at: string; }) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm font-medium">{p.full_name ?? "—"}</TableCell>
                      <TableCell className="text-sm">{p.email ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {p.roles.length > 0
                          ? p.roles.map((r: string) => <Badge key={r} variant="outline" className="mr-1">{r}</Badge>)
                          : <span className="text-xs text-muted-foreground">none</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default UsersPage;
