import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Lightbulb,
  Sparkles,
  Store,
  Target,
} from "lucide-react";
import type { UserProfile } from "../App";
import { supabase } from "../lib/supabase";
import Button from "./ui/button";

interface Props {
  userProfile: UserProfile;
}

interface PlanItem {
  id: string;
  title: string;
  detail: string;
  period: string;
}

interface ScheduledItem extends PlanItem {
  date: Date;
}

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

function formatLocalDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const areaNames: Record<string, string> = {
  tecnologia: "Tecnologia",
  marketing: "Marketing",
  vendas: "Vendas",
  gestao: "Gestão",
  financas: "Finanças",
  criatividade: "Área criativa",
};

const roleNames: Record<string, string> = {
  estudante: "Estudante",
  "pequeno-negocio": "Pequeno negócio",
  empreendedor: "Empreendedor",
  gestor: "Gestor de equipe",
  freelancer: "Freelancer",
  criador: "Criador de conteúdo",
  profissional: "Profissional",
};

const areaPlans: Record<string, PlanItem[]> = {
  tecnologia: [
    { id: "tech-1", title: "Definir uma habilidade prioritária", detail: "Escolha uma competência técnica conectada ao seu objetivo principal.", period: "Esta semana" },
    { id: "tech-2", title: "Criar um projeto prático", detail: "Transforme o estudo em uma entrega pequena, útil e demonstrável.", period: "Próximos 30 dias" },
    { id: "tech-3", title: "Validar com usuários ou pares", detail: "Colete feedback e documente as melhorias realizadas.", period: "Em 90 dias" },
  ],
  marketing: [
    { id: "marketing-1", title: "Definir público e mensagem", detail: "Resuma para quem você fala, qual problema resolve e seu diferencial.", period: "Esta semana" },
    { id: "marketing-2", title: "Montar um calendário de conteúdo", detail: "Planeje temas, formatos e canais para quatro semanas.", period: "Próximos 30 dias" },
    { id: "marketing-3", title: "Analisar e otimizar resultados", detail: "Compare alcance, conversão e retenção para repetir o que funciona.", period: "Em 90 dias" },
  ],
  vendas: [
    { id: "sales-1", title: "Mapear o cliente ideal", detail: "Liste perfil, dores, objeções e sinais de intenção de compra.", period: "Esta semana" },
    { id: "sales-2", title: "Criar uma rotina de prospecção", detail: "Defina canais, abordagem e uma meta semanal realista.", period: "Próximos 30 dias" },
    { id: "sales-3", title: "Aprimorar o processo comercial", detail: "Registre etapas, conversões e motivos de perda.", period: "Em 90 dias" },
  ],
  gestao: [
    { id: "management-1", title: "Escolher prioridades claras", detail: "Defina até três resultados que realmente importam neste ciclo.", period: "Esta semana" },
    { id: "management-2", title: "Organizar rituais de acompanhamento", detail: "Crie uma revisão semanal curta com decisões e responsáveis.", period: "Próximos 30 dias" },
    { id: "management-3", title: "Delegar com autonomia", detail: "Documente acordos, indicadores e limites de decisão.", period: "Em 90 dias" },
  ],
  financas: [
    { id: "finance-1", title: "Registrar entradas e saídas", detail: "Centralize movimentações pessoais ou do negócio em uma visão simples.", period: "Esta semana" },
    { id: "finance-2", title: "Criar uma meta financeira", detail: "Defina valor, prazo e contribuição periódica necessária.", period: "Próximos 30 dias" },
    { id: "finance-3", title: "Revisar custos e margem", detail: "Identifique desperdícios e oportunidades de melhorar o resultado.", period: "Em 90 dias" },
  ],
  criatividade: [
    { id: "creative-1", title: "Definir uma direção criativa", detail: "Reúna referências e critérios para orientar suas escolhas.", period: "Esta semana" },
    { id: "creative-2", title: "Produzir uma série autoral", detail: "Crie entregas conectadas para desenvolver consistência e repertório.", period: "Próximos 30 dias" },
    { id: "creative-3", title: "Publicar e coletar feedback", detail: "Apresente seu trabalho e transforme retornos em ajustes objetivos.", period: "Em 90 dias" },
  ],
};

const goalTips: Record<string, string> = {
  "primeiro-estagio": "Pesquise empresas-alvo, adapte seu currículo e pratique como apresentar seus projetos em entrevistas.",
  portfolio: "Publique projetos com contexto, decisões técnicas, imagens e uma explicação clara do que você aprendeu.",
  produtividade: "Reserve blocos de foco e agrupe tarefas parecidas para reduzir trocas de contexto.",
  redes: "Escolha um canal principal e acompanhe uma métrica ligada ao seu objetivo, não apenas curtidas.",
  equipe: "Toda tarefa delegada deve ter resultado esperado, responsável e uma data de revisão.",
  conteudo: "Mantenha um banco de ideias e produza conteúdos em lote para ganhar consistência.",
  metas: "Faça uma revisão semanal: avance, ajuste ou descarte metas que perderam relevância.",
  tempo: "Antes de adicionar algo à agenda, defina o que deixará de ser prioridade.",
};

export default function Planejamento({ userProfile }: Props) {
  const plan = areaPlans[userProfile.area] ?? areaPlans.gestao;
  const [completed, setCompleted] = useState<string[]>([]);
  const [planStartDate, setPlanStartDate] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState<string[]>([]);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const today = useMemo(() => new Date(), []);
  const scheduledItems = useMemo<ScheduledItem[]>(
    () => planStartDate
      ? plan.map((item, index) => {
          const date = new Date(
            planStartDate.getFullYear(),
            planStartDate.getMonth(),
            planStartDate.getDate(),
          );
          date.setDate(date.getDate() + [3, 14, 90][index]);
          return { ...item, date };
        })
      : [],
    [plan, planStartDate],
  );
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState("");
  const isSmallBusiness = userProfile.role === "pequeno-negocio";

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setLoadError(null);

    void (async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("Não foi possível identificar sua conta.");
        }

        const [profileResult, completedResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("plano_iniciado_em")
            .eq("id", user.id)
            .single(),
          supabase.from("plano_etapas").select("etapa_id"),
        ]);

        if (profileResult.error || completedResult.error || !profileResult.data) {
          throw new Error("Não foi possível carregar seu planejamento.");
        }

        let startDateString = profileResult.data.plano_iniciado_em;
        if (!startDateString) {
          const todayString = formatLocalDate(new Date());
          const { data, error } = await supabase
            .from("profiles")
            .update({ plano_iniciado_em: todayString })
            .eq("id", user.id)
            .is("plano_iniciado_em", null)
            .select("plano_iniciado_em")
            .maybeSingle();

          if (error) {
            throw new Error("Não foi possível registrar o início do planejamento.");
          }

          if (data?.plano_iniciado_em) {
            startDateString = data.plano_iniciado_em;
          } else {
            const { data: currentProfile, error: reloadError } = await supabase
              .from("profiles")
              .select("plano_iniciado_em")
              .eq("id", user.id)
              .single();
            if (reloadError || !currentProfile?.plano_iniciado_em) {
              throw new Error("Não foi possível carregar a data de início do planejamento.");
            }
            startDateString = currentProfile.plano_iniciado_em;
          }
        }

        if (!active) return;
        const startDate = parseLocalDate(startDateString);
        const firstScheduledDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 3,
        );
        const planIds = new Set(plan.map((item) => item.id));
        setPlanStartDate(startDate);
        setCompleted(
          completedResult.data
            .map((row) => row.etapa_id)
            .filter((id) => planIds.has(id)),
        );
        setSelectedDate(dateKey(firstScheduledDate));
        setViewDate(new Date(firstScheduledDate.getFullYear(), firstScheduledDate.getMonth(), 1));
        setLoaded(true);
      } catch {
        if (!active) return;
        setLoadError("Não foi possível carregar seu planejamento. Tente novamente.");
      }
    })();

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const progress = Math.round((completed.length / plan.length) * 100);
  const tips = useMemo(
    () => userProfile.goals.slice(0, 3).map((goal) => goalTips[goal]).filter(Boolean),
    [userProfile.goals],
  );

  const toggleItem = async (id: string) => {
    if (pendingItems.includes(id)) return;
    setPendingItems((current) => [...current, id]);
    setOperationError(null);

    try {
      if (completed.includes(id)) {
        const { data, error } = await supabase
          .from("plano_etapas")
          .delete()
          .eq("etapa_id", id)
          .select("etapa_id")
          .maybeSingle();
        if (error || !data) {
          setOperationError("Não foi possível atualizar a etapa. Tente novamente.");
          return;
        }
        setCompleted((current) => current.filter((item) => item !== id));
      } else {
        const { data, error } = await supabase
          .from("plano_etapas")
          .insert({ etapa_id: id })
          .select("etapa_id")
          .single();
        if (error || !data) {
          setOperationError("Não foi possível atualizar a etapa. Tente novamente.");
          return;
        }
        setCompleted((current) => [...current, data.etapa_id]);
      }
    } catch {
      setOperationError("Não foi possível atualizar a etapa. Tente novamente.");
    } finally {
      setPendingItems((current) => current.filter((item) => item !== id));
    }
  };

  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const calendarCells: Array<number | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const selectedItems = scheduledItems.filter((item) => dateKey(item.date) === selectedDate);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  const changeMonth = (offset: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const selectScheduledItem = (item: ScheduledItem) => {
    setViewDate(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
    setSelectedDate(dateKey(item.date));
  };

  if (!loaded) {
    return (
      <div id="planejamento" className="mx-auto max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          {loadError ? (
            <>
              <p className="text-sm text-error" role="alert">{loadError}</p>
              <Button
                type="button"
                className="mt-4 sm:w-auto"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              >
                Tentar novamente
              </Button>
            </>
          ) : (
            <p className="flex items-center justify-center gap-3 text-muted" role="status">
              <span className="size-5 animate-spin rounded-full border-2 border-accent border-r-transparent" aria-hidden="true" />
              Carregando seu planejamento...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="planejamento" className="mx-auto max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
      <header className="overflow-hidden rounded-3xl bg-panel px-6 py-8 text-panel-text shadow-card sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-panel-glow px-3 py-1.5 text-xs font-medium text-panel-muted">
              <Sparkles className="size-4 text-circle-orange" aria-hidden="true" />
              Plano personalizado
            </div>
            <div className="text-3xl font-semibold tracking-tight sm:text-4xl" role="heading" aria-level={1}>
              Seu caminho em {areaNames[userProfile.area] ?? "Gestão"}
            </div>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-panel-muted">
              Um plano prático para o seu perfil de {roleNames[userProfile.role]?.toLowerCase() ?? "profissional"},
              construído a partir dos objetivos que você selecionou.
            </p>
          </div>
          <div className="min-w-52 rounded-2xl border border-white/10 bg-panel-glow p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-panel-muted">Progresso do ciclo</span>
              <span className="font-mono text-sm font-semibold">{progress}%</span>
            </div>
            <progress className="progress-bar mt-3" value={progress} max={100}>
              {progress}%
            </progress>
            <p className="mt-3 text-xs text-panel-muted">{completed.length} de {plan.length} marcos concluídos</p>
          </div>
        </div>
      </header>

      {operationError && (
        <p className="mt-5 rounded-xl border border-error/30 bg-surface px-4 py-3 text-sm text-error" role="alert">
          {operationError}
        </p>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.65fr)]">
        <section aria-labelledby="roadmap-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div id="roadmap-title" className="text-xl font-semibold text-text" role="heading" aria-level={2}>
                Roteiro de 90 dias
              </div>
              <p className="mt-1 text-sm text-muted">Avance no seu ritmo e marque cada etapa concluída.</p>
            </div>
            <CalendarCheck2 className="hidden size-6 text-accent sm:block" aria-hidden="true" />
          </div>

          <div className="grid gap-4">
            {plan.map((item, index) => {
              const isDone = completed.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-surface p-5 shadow-card transition ${
                    isDone ? "border-success-strong/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Button
                      type="button"
                      variant="icon"
                      className={`size-11 shrink-0 rounded-xl border ${
                        isDone
                          ? "border-success-strong bg-success-soft text-success-strong"
                          : "border-border bg-bg text-muted"
                      }`}
                      onClick={() => toggleItem(item.id)}
                      disabled={pendingItems.includes(item.id)}
                      aria-label={isDone ? `Marcar ${item.title} como pendente` : `Concluir ${item.title}`}
                    >
                      {isDone ? <Check className="size-5" aria-hidden="true" /> : <Circle className="size-5" aria-hidden="true" />}
                    </Button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`font-semibold ${isDone ? "text-muted line-through" : "text-text"}`}>
                          {item.title}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-bg px-2.5 py-1 font-mono text-xs text-muted">
                          <Clock3 className="size-3.5" aria-hidden="true" />
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent-dark">
                        Etapa {index + 1}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          {isSmallBusiness && (
            <section className="rounded-2xl border border-accent/20 bg-accent-light p-5" aria-labelledby="business-title">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-white">
                <Store className="size-5" aria-hidden="true" />
              </span>
              <div id="business-title" className="mt-4 font-semibold text-text" role="heading" aria-level={2}>
                Foco para o pequeno negócio
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Seu plano prioriza ações simples, baixo custo e impacto mensurável. Separe a rotina operacional
                do tempo dedicado ao crescimento.
              </p>
              <div className="mt-4 rounded-xl bg-surface/70 p-3 text-sm font-medium text-accent-dark">
                Acompanhe semanalmente: caixa, novos clientes e horas investidas.
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card" aria-labelledby="tips-title">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-warning-soft text-warning-strong">
                <Lightbulb className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div id="tips-title" className="font-semibold text-text" role="heading" aria-level={2}>
                  Dicas para seus objetivos
                </div>
                <p className="text-xs text-muted">Baseadas nas suas escolhas</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {tips.map((tip, index) => (
                <div key={tip} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-xs font-bold text-accent-dark">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card" aria-labelledby="ritual-title">
            <BookOpenCheck className="size-5 text-accent" aria-hidden="true" />
            <div id="ritual-title" className="mt-3 font-semibold text-text" role="heading" aria-level={2}>
              Ritual de sexta-feira
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Em 15 minutos, registre o que avançou, o principal aprendizado e a prioridade da próxima semana.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent-dark">
              <Target className="size-4" aria-hidden="true" />
              Consistência antes de intensidade
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-10" aria-labelledby="calendar-title">
        <div className="mb-5">
          <div id="calendar-title" className="text-xl font-semibold text-text" role="heading" aria-level={2}>
            Calendário do planejamento
          </div>
          <p className="mt-1 text-sm text-muted">
            Visualize as datas sugeridas para os principais marcos do seu plano.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="icon"
                className="border border-border bg-bg"
                onClick={() => changeMonth(-1)}
                aria-label="Mês anterior"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </Button>
              <div className="text-base font-semibold capitalize text-text" aria-live="polite">
                {monthLabel}
              </div>
              <Button
                type="button"
                variant="icon"
                className="border border-border bg-bg"
                onClick={() => changeMonth(1)}
                aria-label="Próximo mês"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <span key={day} className="py-2 text-center text-xs font-medium text-muted">
                  {day}
                </span>
              ))}
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return <span key={`empty-${index}`} aria-hidden="true" />;
                }

                const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const key = dateKey(cellDate);
                const items = scheduledItems.filter((item) => dateKey(item.date) === key);
                const isSelected = selectedDate === key;
                const isToday = dateKey(today) === key;

                return (
                  <Button
                    key={key}
                    type="button"
                    variant="icon"
                    className={`relative !size-auto aspect-square rounded-xl text-sm ${
                      isSelected
                        ? "bg-accent text-white hover:bg-accent-dark hover:text-white"
                        : isToday
                          ? "bg-accent-light font-semibold text-accent-dark"
                          : "text-text hover:bg-bg"
                    }`}
                    onClick={() => setSelectedDate(key)}
                    aria-label={`${day} de ${monthLabel}${items.length ? `, ${items.length} tarefa planejada` : ""}`}
                    aria-pressed={isSelected}
                  >
                    {day}
                    {items.length > 0 && (
                      <span
                        className={`absolute bottom-1.5 size-1.5 rounded-full ${
                          isSelected ? "bg-white" : "bg-accent"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <aside className="border-t border-border bg-bg p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-light text-accent-dark">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="font-semibold text-text" role="heading" aria-level={3}>
                  Tarefas agendadas
                </div>
                <p className="text-xs text-muted">Selecione uma data com marcador</p>
              </div>
            </div>

            <div className="mt-5">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-accent/20 bg-surface p-4">
                    <span className="text-xs font-semibold text-accent-dark">
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "long",
                      }).format(item.date)}
                    </span>
                    <p className="mt-2 font-semibold text-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-4 h-10"
                      onClick={() => toggleItem(item.id)}
                      disabled={pendingItems.includes(item.id)}
                    >
                      {completed.includes(item.id) ? (
                        <>
                          <Check className="size-4" aria-hidden="true" />
                          Concluída
                        </>
                      ) : (
                        <>
                          <Circle className="size-4" aria-hidden="true" />
                          Marcar como concluída
                        </>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border-strong p-5 text-center">
                  <p className="text-sm font-medium text-text">Nenhuma tarefa nesta data</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Use os atalhos abaixo para encontrar os próximos marcos.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Próximos marcos</p>
              {scheduledItems.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  className="h-auto !justify-start gap-3 px-3 py-2.5 text-left"
                  onClick={() => selectScheduledItem(item)}
                >
                  <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-surface text-accent-dark shadow-card">
                    <span className="text-xs font-bold leading-none">{item.date.getDate()}</span>
                    <span className="mt-0.5 text-xs uppercase leading-none">
                      {new Intl.DateTimeFormat("pt-BR", { month: "short" })
                        .format(item.date)
                        .replace(".", "")}
                    </span>
                  </span>
                  <span className="min-w-0 truncate text-sm font-medium text-text">{item.title}</span>
                </Button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
