import { useState } from "react"

import { supabase } from "../lib/supabase"

import Button from "./ui/button"

import Input from "./ui/input"

import Label from "./ui/label"

interface Props {
  onBackToLogin: () => void
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

export default function ForgotPassword({ onBackToLogin }: Props) {
  const [email, setEmail] = useState("")

  const [emailError, setEmailError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const [requestSent, setRequestSent] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      setEmailError("Informe seu e-mail.")

      return
    }

    if (!emailPattern.test(email)) {
      setEmailError("Digite um e-mail válido.")

      return
    }

    setEmailError(null)

    setLoading(true)

    try {
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      })
    } catch {
      // Keep the response identical whether or not an account exists.
    } finally {
      setLoading(false)

      setRequestSent(true)
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
              Redefinir senha
            </h1>
            <p className="mt-3 text-base text-muted">
              Informe seu e-mail para receber um link de redefinição
            </p>
          </div>
          {requestSent ? (
            <div className="flex flex-col gap-6">
              <p
                className="rounded-lg border border-accent/20 bg-accent-light p-4 text-sm font-medium text-text"
                role="status"
              >
                Se o e-mail existir, enviamos um link para redefinir a senha
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
                <Label htmlFor="recovery-email">E-mail</Label>
                <Input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)

                    setEmailError(null)
                  }}
                  placeholder="voce@email.com"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={
                    emailError ? "recovery-email-error" : undefined
                  }
                />
                {emailError && (
                  <p
                    id="recovery-email-error"
                    className="text-sm font-medium text-error"
                    role="alert"
                  >
                    {emailError}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link"}
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
