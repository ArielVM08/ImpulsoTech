import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  Brush,
  Check,
  Code2,
  GraduationCap,
  Megaphone,
  Network,
  PenTool,
  Rocket,
  Store,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ProfileRow, UserProfile } from "../types/profile"
import Button from "./ui/button"
import Input from "./ui/input"

interface Props {
  onComplete: (profile: UserProfile) => Promise<ProfileRow>
}

interface Option {
  value: string
  label: string
  icon?: LucideIcon
}

interface Question {
  id: keyof UserProfile
  question: string
  type: "text" | "options" | "multi"
  placeholder?: string
  description: string
  options?: Option[]
}

const questions: Question[] = [
  {
    id: "name",
    question: "Como podemos te chamar?",
    type: "text",
    placeholder: "Seu nome",
    description: "Vamos personalizar sua experiência.",
  },
  {
    id: "role",
    question: "Qual é o seu perfil?",
    type: "options",
    description: "Isso nos ajuda a sugerir os melhores recursos para você.",
    options: [
      { value: "estudante", label: "Estudante", icon: GraduationCap },
      { value: "pequeno-negocio", label: "Pequeno negócio", icon: Store },
      { value: "empreendedor", label: "Empreendedor", icon: Rocket },
      { value: "gestor", label: "Gestor de equipe", icon: UsersRound },
      { value: "freelancer", label: "Freelancer", icon: BriefcaseBusiness },
      { value: "criador", label: "Criador de conteúdo", icon: PenTool },
      { value: "profissional", label: "Profissional", icon: UserRound },
    ],
  },
  {
    id: "area",
    question: "Em qual área você quer avançar?",
    type: "options",
    description: "Seu planejamento será construído a partir desta escolha.",
    options: [
      { value: "tecnologia", label: "Tecnologia", icon: Code2 },
      { value: "marketing", label: "Marketing", icon: Megaphone },
      { value: "vendas", label: "Vendas", icon: TrendingUp },
      { value: "gestao", label: "Gestão", icon: UsersRound },
      { value: "financas", label: "Finanças", icon: WalletCards },
      { value: "criatividade", label: "Área criativa", icon: Brush },
    ],
  },
  {
    id: "goals",
    question: "Quais são seus principais objetivos?",
    type: "multi",
    description: "Selecione todos que se aplicam.",
    options: [
      { value: "primeiro-estagio", label: "Conseguir meu primeiro estágio" },
      { value: "portfolio", label: "Montar meu portfólio" },
      { value: "produtividade", label: "Aumentar produtividade" },
      { value: "redes", label: "Gerenciar redes sociais" },
      { value: "equipe", label: "Coordenar equipe" },
      { value: "conteudo", label: "Organizar conteúdo" },
      { value: "metas", label: "Acompanhar metas" },
      { value: "tempo", label: "Otimizar tempo" },
    ],
  },
  {
    id: "teamSize",
    question: "Qual é o tamanho do seu time?",
    type: "options",
    description: "Usaremos isso para calibrar as ferramentas colaborativas.",
    options: [
      { value: "solo", label: "Só eu", icon: UserRound },
      { value: "pequeno", label: "2 a 5 pessoas", icon: UsersRound },
      { value: "medio", label: "6 a 20 pessoas", icon: Network },
      { value: "grande", label: "Mais de 20", icon: Building2 },
    ],
  },
]

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    name: "",
    role: "",
    area: "",
    goals: [],
    teamSize: "",
  })

  const visibleQuestions =
    answers.role === "estudante"
      ? questions.filter((question) => question.id !== "teamSize")
      : questions
  const q = visibleQuestions[step]
  const isLast = step === visibleQuestions.length - 1

  const canAdvance = () => {
    const val = answers[q.id]
    if (q.type === "multi") return (val as string[]).length > 0
    return !!val
  }

  const advance = async () => {
    if (!canAdvance() || saving) return
    if (isLast) {
      setSaving(true)
      setSaveError(null)
      try {
        await onComplete({
          name: answers.name as string,
          role: answers.role as string,
          area: answers.area as string,
          goals: answers.goals as string[],
          teamSize:
            answers.role === "estudante" ? "solo" : answers.teamSize as string,
        })
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Não foi possível salvar suas respostas. Tente novamente.",
        )
      } finally {
        setSaving(false)
      }
    } else {
      setStep((s) => s + 1)
    }
  }

  const toggleGoal = (value: string) => {
    const current = answers.goals as string[]
    setAnswers((a) => ({
      ...a,
      goals: current.includes(value)
        ? current.filter((g) => g !== value)
        : [...current, value],
    }))
  }

  const progress = ((step + 1) / visibleQuestions.length) * 100

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6">
      <div className="w-full max-w-xl">
        <div className="mb-14 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white shadow-accent">
            I
          </span>
          <span className="text-lg font-semibold tracking-tight text-text">
            ImpulsoTech
          </span>
        </div>

        <div className="mb-12 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            {step + 1}/{visibleQuestions.length}
          </span>
        </div>

        <div
          key={step}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <p className="mb-2 text-sm text-muted">{q.description}</p>
          <div
            className="mb-8 text-3xl font-semibold tracking-tight text-text"
            role="heading"
            aria-level={1}
          >
            {q.question}
          </div>

          {q.type === "text" && (
            <Input
              autoFocus
              type="text"
              value={answers[q.id] as string}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && advance()}
              placeholder={q.placeholder}
              className="text-base"
            />
          )}

          {q.type === "options" && q.options && (
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value
                const Icon = opt.icon
                return (
                  <Button
                    key={opt.value}
                    type="button"
                    variant="card"
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [q.id]: opt.value }))
                    }
                    className={`min-h-28 flex-col gap-3 p-4 ${
                      selected
                        ? "border-accent bg-accent-light shadow-none"
                        : ""
                    }`}
                    aria-pressed={selected}
                  >
                    {Icon && (
                      <span
                        className={`flex size-9 items-center justify-center rounded-lg ${
                          selected ? "bg-accent text-white" : "bg-bg text-muted"
                        }`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    )}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </Button>
                )
              })}
            </div>
          )}

          {q.type === "multi" && q.options && (
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => {
                const goals = answers.goals as string[]
                const selected = goals.includes(opt.value)
                return (
                  <Button
                    key={opt.value}
                    type="button"
                    variant="secondary"
                    onClick={() => toggleGoal(opt.value)}
                    className={`justify-start ${
                      selected ? "border-accent bg-accent-light" : ""
                    }`}
                    aria-pressed={selected}
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                        selected
                          ? "border-accent bg-accent text-white"
                          : "border-border-strong"
                      }`}
                    >
                      {selected && (
                        <Check className="size-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </Button>
                )
              })}
            </div>
          )}
        </div>

        {saveError && (
          <p className="mt-6 text-sm font-medium text-error" role="alert">
            {saveError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={saving}
            className={`w-auto px-3 ${step === 0 ? "invisible" : ""}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar
          </Button>
          <Button
            type="button"
            onClick={advance}
            disabled={!canAdvance() || saving}
            className="w-auto px-8"
          >
            {saving ? "Salvando..." : isLast ? "Criar meu plano" : "Continuar"}
            {!saving && <ArrowRight className="size-4" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
