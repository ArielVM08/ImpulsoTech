import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import type { CategoriaMeta, Meta } from "../types/pdi";
import Button from "./ui/button";
import Input from "./ui/input";
import Label from "./ui/label";
import Select from "./ui/select";
import Textarea from "./ui/textarea";

interface NovaMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta?: Meta | null;
  onSave: (meta: Omit<Meta, "id" | "status">) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  isSaving: boolean;
}

const emptyForm = {
  titulo: "",
  categoria: "Técnica" as CategoriaMeta,
  prazo: "",
  descricao: "",
  progresso: 0,
};

export default function NovaMetaDialog({
  open,
  onOpenChange,
  meta,
  onSave,
  onDelete,
  isSaving,
}: NovaMetaDialogProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(
      meta
        ? {
            titulo: meta.titulo,
            categoria: meta.categoria,
            prazo: meta.prazo,
            descricao: meta.descricao,
            progresso: meta.progresso,
          }
        : emptyForm,
    );
  }, [meta, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onSave(form)) onOpenChange(false);
  };

  const handleDelete = async () => {
    if (await onDelete()) onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-dialog outline-none sm:p-7">
          <div className="pr-10">
            <Dialog.Title className="text-2xl font-semibold tracking-tight text-text">
              {meta ? "Editar meta" : "Nova meta"}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
              {meta
                ? "Atualize as informações da sua meta."
                : "Crie um objetivo claro para acompanhar seu desenvolvimento."}
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <Button
              type="button"
              variant="icon"
              className="absolute right-5 top-5 size-10 p-0"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </Dialog.Close>

          <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-title">Título</Label>
              <Input
                id="goal-title"
                value={form.titulo}
                onChange={(event) => setForm({ ...form, titulo: event.target.value })}
                placeholder="Ex.: Concluir curso de React"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="goal-category">Categoria</Label>
                <Select
                  id="goal-category"
                  value={form.categoria}
                  onChange={(event) =>
                    setForm({ ...form, categoria: event.target.value as CategoriaMeta })
                  }
                >
                  <option value="Técnica">Técnica</option>
                  <option value="Comportamental">Comportamental</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="goal-date">Prazo</Label>
                <Input
                  id="goal-date"
                  type="date"
                  value={form.prazo}
                  onChange={(event) => setForm({ ...form, prazo: event.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-description">Descrição</Label>
              <Textarea
                id="goal-description"
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                placeholder="Descreva o resultado que você quer alcançar"
                required
              />
            </div>

            {meta && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="goal-progress">Progresso</Label>
                  <span className="font-mono text-sm font-semibold text-accent-dark">
                    {form.progresso}%
                  </span>
                </div>
                <Input
                  id="goal-progress"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={form.progresso}
                  onChange={(event) =>
                    setForm({ ...form, progresso: Number(event.target.value) })
                  }
                  className="cursor-pointer border-0 bg-transparent px-0 shadow-none"
                />
              </div>
            )}

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {meta ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-error sm:w-auto"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remover
                </Button>
              ) : (
                <span />
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" className="sm:w-auto" disabled={isSaving}>
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" className="sm:w-auto" disabled={isSaving}>
                {isSaving ? "Salvando..." : meta ? "Salvar alterações" : "Criar meta"}
              </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
