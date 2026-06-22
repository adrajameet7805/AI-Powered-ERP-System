import React from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { roles } = useAuth();
  const currentRole = roles[0] || "Employee";

  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 p-12">
        <ShieldCheck className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground text-sm text-center">
          You don't have permission to view this page.
          <br />
          Contact your Admin to request access.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
