import { ChevronRight } from "lucide-react";
import type { Competencia } from "../types/pdi";
import Button from "./ui/button";

interface CompetenciaItemProps {
  competencia: Competencia;
  onClick: () => void;
}

export default function CompetenciaItem({ competencia, onClick }: CompetenciaItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto !justify-start rounded-lg px-1 py-3 text-left"
      onClick={onClick}
      aria-label={`Editar competência ${competencia.nome}`}
    >
      <span className="text-sm font-medium text-text">{competencia.nome}</span>
      <div
        className="ml-auto flex shrink-0 items-center gap-1.5"
        aria-label={`Nível ${competencia.nivel} de 5`}
        role="img"
      >
        {[1, 2, 3, 4, 5].map((nivel) => (
          <span
            key={nivel}
            className={`size-2.5 rounded-full ${
              nivel <= competencia.nivel ? "bg-accent" : "bg-border"
            }`}
            aria-hidden="true"
          />
        ))}
        <span className="ml-2 w-6 text-right text-xs font-semibold text-muted">
          {competencia.nivel}/5
        </span>
      </div>
      <ChevronRight className="size-4 shrink-0 text-placeholder" aria-hidden="true" />
    </Button>
  );
}
