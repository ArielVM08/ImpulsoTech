import type { ReactNode } from "react";
import { CalendarRange, LogOut, Target } from "lucide-react";
import Button from "./ui/button";

interface SidebarLayoutProps {
  children: ReactNode;
  userName: string;
  onLogout: () => void;
  activeItem: "pdi" | "planejamento";
  onNavigate: (item: "pdi" | "planejamento") => void;
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-accent font-bold text-white shadow-accent">
        I
      </span>
      <span className="text-xl font-semibold tracking-tight text-text">ImpulsoTech</span>
    </div>
  );
}

export default function SidebarLayout({
  children,
  userName,
  onLogout,
  activeItem,
  onNavigate,
}: SidebarLayoutProps) {
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface px-5 py-7 lg:flex">
        <div className="px-2">
          <Brand />
        </div>

        <nav className="mt-12 flex flex-1 flex-col gap-2" aria-label="Navegação principal">
          <Button
            type="button"
            variant="ghost"
            className={`flex !justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-accent-ring ${
              activeItem === "pdi"
                ? "bg-accent-light font-semibold text-accent-dark"
                : "font-medium text-muted hover:bg-bg hover:text-text"
            }`}
            aria-current={activeItem === "pdi" ? "page" : undefined}
            onClick={() => onNavigate("pdi")}
          >
            <Target className="size-5" aria-hidden="true" />
            Meu PDI
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={`flex !justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-accent-ring ${
              activeItem === "planejamento"
                ? "bg-accent-light font-semibold text-accent-dark"
                : "font-medium text-muted hover:bg-bg hover:text-text"
            }`}
            aria-current={activeItem === "planejamento" ? "page" : undefined}
            onClick={() => onNavigate("planejamento")}
          >
            <CalendarRange className="size-5" aria-hidden="true" />
            Planejamento
          </Button>
        </nav>

        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-3 px-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent-dark">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{userName || "Aluno"}</p>
              <p className="text-xs text-muted">Aluno</p>
            </div>
            <Button
              type="button"
              variant="icon"
              className="size-10 shrink-0 p-0"
              onClick={onLogout}
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur lg:hidden">
        <Brand />
        <Button
          type="button"
          variant="icon"
          className="size-10 p-0"
          onClick={onLogout}
          aria-label="Sair"
        >
          <LogOut className="size-5" aria-hidden="true" />
        </Button>
      </header>

      <main className="pb-28 lg:ml-64 lg:pb-0">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-border bg-surface/95 px-4 py-2 backdrop-blur lg:hidden"
        aria-label="Navegação principal"
      >
        <Button
          type="button"
          variant="ghost"
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs outline-none focus-visible:ring-4 focus-visible:ring-accent-ring ${
            activeItem === "pdi" ? "font-semibold text-accent-dark" : "font-medium text-muted"
          }`}
          aria-current={activeItem === "pdi" ? "page" : undefined}
          onClick={() => onNavigate("pdi")}
        >
          <Target className="size-5" aria-hidden="true" />
          Meu PDI
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs outline-none focus-visible:ring-4 focus-visible:ring-accent-ring ${
            activeItem === "planejamento" ? "font-semibold text-accent-dark" : "font-medium text-muted"
          }`}
          aria-current={activeItem === "planejamento" ? "page" : undefined}
          onClick={() => onNavigate("planejamento")}
        >
          <CalendarRange className="size-5" aria-hidden="true" />
          Planejamento
        </Button>
      </nav>
    </div>
  );
}
