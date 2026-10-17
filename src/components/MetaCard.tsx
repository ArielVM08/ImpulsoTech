import { CalendarDays, ChevronRight } from "lucide-react";
import type { Meta } from "../types/pdi";
import Button from "./ui/button";

interface MetaCardProps {
  meta: Meta;
  onClick: () => void;
}

const statusStyles: Record<Meta["status"], string> = {
  "Não iniciada": "bg-neutral-soft text-neutral-strong",
  "Em andamento": "bg-warning-soft text-warning-strong",
  Concluída: "bg-success-soft text-success-strong",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function MetaCard({ meta, onClick }: MetaCardProps) {
  return (
    <Button
      type="button"
      variant="card"
      onClick={onClick}
      className="group block"
      aria-label={`Editar meta ${meta.titulo}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-semibold text-accent-dark">
              {meta.categoria}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[meta.status]}`}>
              {meta.status}
            </span>
          </div>
          <p className="text-lg font-semibold leading-snug text-text">{meta.titulo}</p>
        </div>
        <ChevronRight
          className="mt-1 size-5 shrink-0 text-placeholder transition group-hover:translate-x-1 group-hover:text-accent"
          aria-hidden="true"
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatDate(meta.prazo)}
        </span>
        <span className="font-semibold text-text">{meta.progresso}%</span>
      </div>
      <progress
        className="progress-bar mt-3"
        value={meta.progresso}
        max="100"
        aria-label={`Progresso: ${meta.progresso}%`}
      />
    </Button>
  );
}
