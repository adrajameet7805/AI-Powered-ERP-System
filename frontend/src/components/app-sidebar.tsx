import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Boxes, Users, ShoppingCart, Truck, Receipt,
  UserCog, FolderKanban, Wrench, Brain, BarChart3, Bell, Settings, Sparkles, ShieldCheck,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

const groups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Employee"] },
    ]
  },
  {
    label: "Operations",
    items: [
      { title: "CRM", url: "/crm", icon: Users, roles: ["Admin", "Manager"] },
      { title: "Inventory", url: "/inventory", icon: Boxes, roles: ["Admin", "Manager", "Employee"] },
      { title: "Sales", url: "/sales", icon: ShoppingCart, roles: ["Admin", "Manager"] },
      { title: "Purchase", url: "/purchase", icon: Truck, roles: ["Admin", "Manager"] },
    ]
  },
  {
    label: "Back office",
    items: [
      { title: "Accounting", url: "/accounting", icon: Receipt, roles: ["Admin"] },
      { title: "HR", url: "/hr", icon: UserCog, roles: ["Admin", "Manager"] },
      { title: "Projects", url: "/projects", icon: FolderKanban, roles: ["Admin", "Manager", "Employee"] },
      { title: "Assets", url: "/assets", icon: Wrench, roles: ["Admin", "Manager"] },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { title: "AI Forecasting", url: "/ai-forecast", icon: Brain, roles: ["Admin", "Manager"] },
      { title: "Reports", url: "/reports", icon: BarChart3, roles: ["Admin", "Manager"] },
      { title: "Notifications", url: "/notifications", icon: Bell, roles: ["Admin", "Manager", "Employee"] },
    ]
  },
  {
    label: "Admin",
    items: [
      { title: "Users & Roles", url: "/users", icon: ShieldCheck, roles: ["Admin"] },
    ]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { roles, user } = useAuth();
  const currentRole = roles[0] || "Employee";

  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
    enabled: !!user,
  });

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Nexus ERP</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Enterprise</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => {
          const visibleItems = g.items.filter((item) => item.roles.includes(currentRole));
          
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={g.label}>
              <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const active = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                            {!collapsed && item.title === "Notifications" && unreadCount > 0 && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to="/users" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
