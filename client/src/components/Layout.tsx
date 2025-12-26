import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Database, Activity, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSeedSystem } from "@/hooks/use-dualstore";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mutate: seed, isPending: isSeeding } = useSeedSystem();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/logs", label: "Saga Logs", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-card/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-display shadow-md shadow-primary/30">
              DX
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
              DualStore<span className="text-primary">-X</span>
            </span>
          </div>

          <nav className="flex items-center gap-1 md:gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2",
                  location === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => seed()}
            disabled={isSeeding}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isSeeding && "animate-spin")} />
            Reset Data
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-in">
        {children}
      </main>
    </div>
  );
}
