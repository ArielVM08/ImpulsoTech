import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import type {
  Competencia,
  NivelCompetencia,
  TipoCompetencia,
} from "../types/pdi";
import Button from "./ui/button";
import Input from "./ui/input";
import Label from "./ui/label";
import Select from "./ui/select";

type CompetenciaFormData = Omit<Competencia, "id">;

interface CompetenciaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competencia?: Competencia | null;
  onSave: (data: CompetenciaFormData) => void;
  onDelete: () => void;
}

const emptyForm: CompetenciaFormData = {
  nome: "",
  tipo: "Hard skill",
  nivel: 1,
};

export default function CompetenciaDialog({
  open,
  onOpenChange,
  competencia,
  onSave,
  onDelete,
}: CompetenciaDialogProps) {
  const [form, setForm] = useState<CompetenciaFormData>(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(
      competencia
        ? {
            nome: competencia.nome,
            tipo: competencia.tipo,
            nivel: competencia.nivel,
          }
        : emptyForm,
    );
  }, [competencia, open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-dialog outline-none sm:p-7">
          <div className="pr-10">
            <Dialog.Title className="text-2xl font-semibold tracking-tight text-text">
              {competencia ? "Editar competência" : "Nova competência"}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
              Registre uma habilidade e o seu nível atual de domínio.
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <Button
              type="button"
              variant="icon"
              className="absolute right-5 top-5"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </Dialog.Close>

          <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="skill-name">Nome</Label>
              <Input
                id="skill-name"
                value={form.nome}
                onChange={(event) => setForm({ ...form, nome: event.target.value })}
                placeholder="Ex.: Lógica de programação"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-type">Tipo</Label>
                <Select
                  id="skill-type"
                  value={form.tipo}
                  onChange={(event) =>
                    setForm({ ...form, tipo: event.target.value as TipoCompetencia })
                  }
                >
                  <option value="Hard skill">Hard skill</option>
                  <option value="Soft skill">Soft skill</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-level">Nível</Label>
                <Select
                  id="skill-level"
                  value={form.nivel}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      nivel: Number(event.target.value) as NivelCompetencia,
                    })
                  }
                >
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel} de 5
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {competencia ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-error sm:w-auto"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remover
                </Button>
              ) : (
                <span />
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Dialog.Close asChild>
                  <Button type="button" variant="secondary" className="sm:w-auto">
                    Cancelar
                  </Button>
                </Dialog.Close>
                <Button type="submit" className="sm:w-auto">
                  {competencia ? "Salvar alterações" : "Adicionar competência"}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
