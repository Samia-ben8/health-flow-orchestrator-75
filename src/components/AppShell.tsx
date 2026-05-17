import { NavLink, useLocation } from "react-router-dom";
import { Activity, FileText, Home, Stethoscope, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { useConsultation } from "@/context/ConsultationContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home, stage: null },
  { to: "/consultation", label: "Workflow", icon: Activity, stage: "running" },
  { to: "/review", label: "Physician Review", icon: Stethoscope, stage: "physician_review" },
  { to: "/report", label: "Final Report", icon: FileText, stage: "complete" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { stage, threadId } = useConsultation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">MediFlow AI</h1>
            <p className="text-xs text-sidebar-foreground/60">Multi-Agent Clinical</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
          <div className="px-3 py-3 rounded-lg bg-sidebar-accent/50">
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 mb-1">Session</p>
            <p className="text-xs font-mono text-sidebar-foreground truncate">
              {threadId ? threadId.slice(0, 18) + "…" : "No active session"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  stage === "complete"
                    ? "bg-success"
                    : stage === "idle"
                      ? "bg-muted-foreground/40"
                      : "bg-primary animate-pulse-soft",
                )}
              />
              <span className="text-[11px] capitalize text-sidebar-foreground/70">
                {stage.replace("_", " ")}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-sidebar-foreground/40 px-1">
            Powered by LangGraph · FastAPI
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold">MediFlow AI</span>
          </div>
          <span className="text-xs text-muted-foreground capitalize">{stage.replace("_", " ")}</span>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
