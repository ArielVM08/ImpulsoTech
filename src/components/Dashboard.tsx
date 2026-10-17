import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { UserProfile } from "../App";
import type { Competencia, Meta } from "../types/pdi";
import CompetenciaDialog from "./CompetenciaDialog";
import CompetenciaItem from "./CompetenciaItem";
import MetaCard from "./MetaCard";
import NovaMetaDialog from "./NovaMetaDialog";
import Planejamento from "./Planejamento";
import SidebarLayout from "./SidebarLayout";
import Button from "./ui/button";

interface Props {
  userProfile: UserProfile;
  onLogout: () => void;
}

export default function Dashboard({ userProfile, onLogout }: Props) {
  const [activePage, setActivePage] = useState<"pdi" | "planejamento">("pdi");
  const [goals, setGoals] = useState<Meta[]>([]);
  const [skills, setSkills] = useState<Competencia[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Meta | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Competencia | null>(null);

  const activeGoals = goals.filter((goal) => goal.status !== "Concluída").length;
  const completedGoals = goals.filter((goal) => goal.status === "Concluída").length;
  const overallProgress = goals.length
    ? Math.round(goals.reduce((total, goal) => total + goal.progresso, 0) / goals.length)
    : 0;

  const hardSkills = skills.filter((skill) => skill.tipo === "Hard skill");
  const softSkills = skills.filter((skill) => skill.tipo === "Soft skill");
  const chartData = useMemo(
    () => skills.map((skill) => ({ habilidade: skill.nome, nivel: skill.nivel })),
    [skills],
  );

  const openNewGoal = () => {
    setSelectedGoal(null);
    setDialogOpen(true);
  };

  const openGoal = (goal: Meta) => {
    setSelectedGoal(goal);
    setDialogOpen(true);
  };

  const saveGoal = (data: Omit<Meta, "id" | "status">) => {
    const status: Meta["status"] =
      data.progresso === 0
        ? "Não iniciada"
        : data.progresso === 100
          ? "Concluída"
          : "Em andamento";

    if (selectedGoal) {
      setGoals((current) =>
        current.map((goal) =>
          goal.id === selectedGoal.id ? { ...goal, ...data, status } : goal,
        ),
      );
      return;
    }

    setGoals((current) => [
      ...current,
      {
        ...data,
        id: `meta-${Date.now()}`,
        status,
      },
    ]);
  };

  const openNewSkill = () => {
    setSelectedSkill(null);
    setSkillDialogOpen(true);
  };

  const openSkill = (skill: Competencia) => {
    setSelectedSkill(skill);
    setSkillDialogOpen(true);
  };

  const saveSkill = (data: Omit<Competencia, "id">) => {
    if (selectedSkill) {
      setSkills((current) =>
        current.map((skill) =>
          skill.id === selectedSkill.id ? { ...skill, ...data } : skill,
        ),
      );
      return;
    }

    setSkills((current) => [
      ...current,
      {
        ...data,
        id: `skill-${Date.now()}`,
      },
    ]);
  };

  const deleteSkill = () => {
    if (!selectedSkill) return;
    setSkills((current) => current.filter((skill) => skill.id !== selectedSkill.id));
    setSelectedSkill(null);
  };

  const summary = [
    {
      label: "Metas ativas",
      value: activeGoals,
      helper: "em desenvolvimento",
      icon: CircleDot,
      iconStyle: "bg-accent-light text-accent-dark",
    },
    {
      label: "Concluídas",
      value: completedGoals,
      helper: "objetivos alcançados",
      icon: CheckCircle2,
      iconStyle: "bg-success-soft text-success-strong",
    },
    {
      label: "Progresso geral",
      value: `${overallProgress}%`,
      helper: "média de todas as metas",
      icon: TrendingUp,
      iconStyle: "bg-warning-soft text-warning-strong",
    },
  ];

  return (
    <SidebarLayout
      userName={userProfile.name}
      onLogout={onLogout}
      activeItem={activePage}
      onNavigate={setActivePage}
    >
      {activePage === "planejamento" ? (
        <Planejamento userProfile={userProfile} />
      ) : (
      <>
      <div id="pdi" className="mx-auto max-w-screen-2xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">Meu PDI</h1>
            <p className="mt-2 text-base text-muted">
              Defina suas metas e acompanhe sua evolução
            </p>
          </div>
          <Button type="button" className="w-full sm:w-auto" onClick={openNewGoal}>
            <Plus className="size-5" aria-hidden="true" />
            Nova meta
          </Button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Resumo do PDI">
          {summary.map(({ label, value, helper, icon: Icon, iconStyle }) => (
            <article
              key={label}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-text">{value}</p>
                </div>
                <span className={`flex size-10 items-center justify-center rounded-xl ${iconStyle}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-xs text-muted">{helper}</p>
            </article>
          ))}
        </section>

        <section className="mt-10" aria-labelledby="goals-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="goals-title" className="text-xl font-semibold text-text">Minhas metas</h2>
              <p className="mt-1 text-sm text-muted">Selecione uma meta para editar seus detalhes.</p>
            </div>
            <span className="hidden text-sm font-medium text-muted sm:block">
              {goals.length} {goals.length === 1 ? "meta" : "metas"}
            </span>
          </div>
          {goals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {goals.map((goal) => (
                <MetaCard key={goal.id} meta={goal} onClick={() => openGoal(goal)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent-light text-accent-dark">
                <Target className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-text">Você ainda não tem metas.</p>
              <p className="mt-1 text-sm text-muted">
                Crie a primeira para começar a acompanhar sua evolução.
              </p>
              <Button type="button" className="mt-5 sm:w-auto" onClick={openNewGoal}>
                <Plus className="size-4" aria-hidden="true" />
                Criar primeira meta
              </Button>
            </div>
          )}
        </section>

        <section className="mt-10" aria-labelledby="skills-title">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="skills-title" className="text-xl font-semibold text-text">Minhas competências</h2>
              <p className="mt-1 text-sm text-muted">
                Visualize seus pontos fortes e oportunidades de evolução.
              </p>
            </div>
            {skills.length > 0 && (
              <Button type="button" variant="secondary" className="sm:w-auto" onClick={openNewSkill}>
                <Plus className="size-4" aria-hidden="true" />
                Nova competência
              </Button>
            )}
          </div>

          {skills.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.85fr)]">
              <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-text">Hard skills</h3>
                    <span className="text-xs font-medium text-muted">Nível atual</span>
                  </div>
                  <div className="divide-y divide-border">
                    {hardSkills.length > 0 ? (
                      hardSkills.map((skill) => (
                        <CompetenciaItem
                          key={skill.id}
                          competencia={skill}
                          onClick={() => openSkill(skill)}
                        />
                      ))
                    ) : (
                      <p className="py-5 text-sm text-muted">Nenhuma hard skill adicionada.</p>
                    )}
                  </div>
                </article>
                <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-text">Soft skills</h3>
                    <span className="text-xs font-medium text-muted">Nível atual</span>
                  </div>
                  <div className="divide-y divide-border">
                    {softSkills.length > 0 ? (
                      softSkills.map((skill) => (
                        <CompetenciaItem
                          key={skill.id}
                          competencia={skill}
                          onClick={() => openSkill(skill)}
                        />
                      ))
                    ) : (
                      <p className="py-5 text-sm text-muted">Nenhuma soft skill adicionada.</p>
                    )}
                  </div>
                </article>
              </div>

              <article className="min-h-96 rounded-2xl border border-border bg-surface p-5 shadow-card">
                <div>
                  <h3 className="font-semibold text-text">Mapa de competências</h3>
                  <p className="mt-1 text-sm text-muted">Visão geral dos seus níveis atuais</p>
                </div>
                <div
                  className="mt-4 h-72 w-full"
                  aria-label="Gráfico radar das competências"
                  role="img"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} outerRadius="68%">
                      <PolarGrid stroke="var(--color-border-strong)" />
                      <PolarAngleAxis
                        dataKey="habilidade"
                        tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                      />
                      <Radar
                        dataKey="nivel"
                        stroke="var(--color-accent)"
                        fill="var(--color-accent)"
                        fillOpacity={0.18}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent-light text-accent-dark">
                <TrendingUp className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-text">Você ainda não tem competências.</p>
              <p className="mt-1 text-sm text-muted">
                Adicione suas habilidades técnicas e comportamentais.
              </p>
              <Button type="button" className="mt-5 sm:w-auto" onClick={openNewSkill}>
                <Plus className="size-4" aria-hidden="true" />
                Adicionar competência
              </Button>
            </div>
          )}
        </section>
      </div>

      <NovaMetaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        meta={selectedGoal}
        onSave={saveGoal}
      />
      <CompetenciaDialog
        open={skillDialogOpen}
        onOpenChange={setSkillDialogOpen}
        competencia={selectedSkill}
        onSave={saveSkill}
        onDelete={deleteSkill}
      />
      </>
      )}
    </SidebarLayout>
  );
}
