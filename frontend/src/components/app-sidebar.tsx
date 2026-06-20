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

const groups = [
  { label: "Overview", items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }] },
  { label: "Operations", items: [
    { title: "CRM", url: "/crm", icon: Users },
    { title: "Inventory", url: "/inventory", icon: Boxes },
    { title: "Sales", url: "/sales", icon: ShoppingCart },
    { title: "Purchase", url: "/purchase", icon: Truck },
  ]},
  { label: "Back office", items: [
    { title: "Accounting", url: "/accounting", icon: Receipt },
    { title: "HR", url: "/hr", icon: UserCog },
    { title: "Projects", url: "/projects", icon: FolderKanban },
    { title: "Assets", url: "/assets", icon: Wrench },
  ]},
  { label: "Intelligence", items: [
    { title: "AI Forecasting", url: "/ai-forecast", icon: Brain },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ]},
  { label: "Admin", items: [
    { title: "Users & Roles", url: "/users", icon: ShieldCheck },
  ]},
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

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
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
