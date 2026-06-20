// @ts-nocheck
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Activity, BarChart3, Boxes, Brain, ChevronRight, LineChart, ShieldCheck, Sparkles, Users,
} from "lucide-react";

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute top-60 right-10 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[120px]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <span className="font-semibold tracking-tight">Nexus ERP</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Modules</a>
          <a href="#ai" className="hover:text-foreground">AI</a>
          <a href="#security" className="hover:text-foreground">Security</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth"><Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">Get started</Button></Link>
        </div>
      </header>

      <main className="relative z-10 px-6 lg:px-12">
        <section className="mx-auto max-w-5xl pt-20 pb-28 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI-powered demand forecasting · now in preview
          </div>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
            The operating system for <span className="text-gradient">modern enterprises</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
            One platform for inventory, sales, finance, HR and projects — with AI that predicts demand,
            flags stockouts and surfaces what matters before you ask.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                Launch dashboard <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features"><Button size="lg" variant="outline">Explore modules</Button></a>
          </div>
        </section>

        <section id="features" className="mx-auto grid max-w-6xl gap-4 pb-24 md:grid-cols-3">
          {[
            { icon: Boxes, title: "Inventory & Warehouses", body: "Multi-warehouse stock, batches, serials, barcodes — real-time visibility everywhere." },
            { icon: LineChart, title: "Sales & CRM", body: "Pipeline, quotes, invoices and customer communications in one timeline." },
            { icon: BarChart3, title: "Finance & Accounting", body: "GL, AR/AP, P&L and balance sheet generated automatically from every transaction." },
            { icon: Users, title: "HR & Payroll", body: "Employees, attendance, leave, performance and payroll runs in one place." },
            { icon: Brain, title: "AI Forecasting", body: "Predict demand, recommend reorders and detect overstock risks across SKUs." },
            { icon: Activity, title: "Live Analytics", body: "Executive dashboards with drill-down charts and exportable reports." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-xl p-5 transition hover:border-primary/40">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-secondary/30">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        <section id="security" className="mx-auto mb-24 max-w-4xl rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur md:p-12">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/15">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Enterprise-grade by default</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Role-based access control, row-level security, encrypted secrets and audit-ready data —
                with super_admin, admin, manager and employee tiers wired in from day one.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nexus ERP · Built with the Lovable stack
      </footer>
    </div>
  );
}


export default Landing;
