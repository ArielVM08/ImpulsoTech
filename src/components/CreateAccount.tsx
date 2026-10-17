import { useState } from "react"

import { supabase } from "../lib/supabase"

import Button from "./ui/button"

import Input from "./ui/input"

import Label from "./ui/label"

interface Props {
  onBackToLogin: () => void
}

interface FormErrors {
  email?: string

  password?: string

  form?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-base font-bold text-white shadow-accent">
        I
      </span>
      <span className="text-xl font-semibold tracking-tight">ImpulsoTech</span>
    </div>
  )
}

export default function CreateAccount({ onBackToLogin }: Props) {
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [errors, setErrors] = useState<FormErrors>({})

  const [loading, setLoading] = useState(false)

  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail."
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Digite um e-mail válido."
    }

    if (password.length < 8) {
      nextErrors.password = "A senha deve ter pelo menos 8 caracteres."
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),

        password,
      })

      if (error) {
        setErrors({
          form: "Não foi possível criar sua conta. Verifique os dados e tente novamente.",
        })

        return
      }

      if (!data.session) {
        setConfirmationSent(true)
      }
    } catch {
      setErrors({
        form: "Não foi possível criar sua conta. Verifique sua conexão e tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-bg lg:grid-cols-[minmax(28rem,0.92fr)_minmax(32rem,1.08fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-panel px-12 py-10 text-panel-text lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="pointer-events-none absolute -left-28 top-1/3 size-80 rounded-full bg-accent-glow blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-panel-glow blur-3xl" />
        <div className="relative z-10">
          <Brand />
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-light leading-[1.04] tracking-tight xl:text-7xl">
            Organize.
            <br />
            Planeje.
            <br />
            <span className="font-medium text-accent">Cresça.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-panel-muted">
            Sua plataforma para planejar a carreira, mapear competências e
            organizar suas candidaturas.
          </p>
        </div>
        <p className="relative z-10 text-sm font-medium text-panel-muted">
          Projeto de Extensão Unifametro
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-14 lg:hidden">
            <Brand />
          </div>
          <div className="mb-9">
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Criar conta
            </h1>
            <p className="mt-3 text-base text-muted">
              Comece a planejar seu próximo passo
            </p>
          </div>

          {confirmationSent ? (
            <div className="flex flex-col gap-6">
              <p
                className="rounded-lg border border-accent/20 bg-accent-light p-4 text-sm font-medium text-text"
                role="status"
              >
                Enviamos um link de confirmação para o seu e-mail
              </p>
              <Button type="button" variant="secondary" onClick={onBackToLogin}>
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)

                    setErrors((current) => ({ ...current, email: undefined }))
                  }}
                  placeholder="voce@email.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "signup-email-error" : undefined
                  }
                />
                {errors.email && (
                  <p
                    id="signup-email-error"
                    className="text-sm font-medium text-error"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)

                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }))
                  }}
                  placeholder="Mínimo de 8 caracteres"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "signup-password-error" : undefined
                  }
                />
                {errors.password && (
                  <p
                    id="signup-password-error"
                    className="text-sm font-medium text-error"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>
              {errors.form && (
                <p className="text-sm font-medium text-error" role="alert">
                  {errors.form}
                </p>
              )}
              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
              <Button type="button" variant="secondary" onClick={onBackToLogin}>
                Voltar para o login
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
