import { useEffect } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

function AppLayout() {
  const { user, loading, signOut, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const initials =
    (user.user_metadata?.full_name as string | undefined)?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ||
    user.email?.slice(0, 2).toUpperCase() ||
    "ME";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="relative ml-2 hidden flex-1 max-w-md md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search modules, customers, products…" className="pl-9 bg-card/60" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xs text-background">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left text-xs leading-tight md:block">
                      <div className="font-medium">{user.user_metadata?.full_name ?? user.email}</div>
                      <div className="text-muted-foreground">{roles[0] ?? "Employee"}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Account
                    {roles.length > 0 && (
                      <Badge variant="outline" className={`text-[10px] ${
                        roles[0] === "Admin" ? "bg-red-100 text-red-700 border-red-300" :
                        roles[0] === "Manager" ? "bg-blue-100 text-blue-700 border-blue-300" :
                        "bg-green-100 text-green-700 border-green-300"
                      }`}>
                        {roles[0]}
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate("/auth"); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


export default AppLayout;
