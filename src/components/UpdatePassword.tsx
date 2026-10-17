import { useState } from "react"

import { Eye, EyeOff } from "lucide-react"

import { supabase } from "../lib/supabase"

import { translateAuthError } from "../lib/authErrors"

import Button from "./ui/button"

import Input from "./ui/input"

import Label from "./ui/label"

interface Props {
  onContinue: () => void
}

export default function UpdatePassword({ onContinue }: Props) {
  const [password, setPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [confirmError, setConfirmError] = useState<string | null>(null)

  const [formError, setFormError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextPasswordError =
      password.length < 8 ? "A senha deve ter pelo menos 8 caracteres." : null

    const nextConfirmError =
      password !== confirmPassword ? "As senhas não coincidem." : null

    setPasswordError(nextPasswordError)

    setConfirmError(nextConfirmError)

    setFormError(null)

    if (nextPasswordError || nextConfirmError) return

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setFormError(translateAuthError(error.message))

        return
      }

      setSaved(true)
    } catch {
      setFormError("Não foi possível atualizar sua senha. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-10">
      <section className="w-full max-w-md">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-base font-bold text-white shadow-accent">
            I
          </span>
          <span className="text-xl font-semibold tracking-tight text-text">
            ImpulsoTech
          </span>
        </div>
        {saved ? (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-text">
                Senha atualizada
              </h1>
              <p className="mt-3 text-base text-muted" role="status">
                Sua senha foi alterada com sucesso.
              </p>
            </div>
            <Button type="button" onClick={onContinue}>
              Continuar para o app
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-9">
              <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                Definir nova senha
              </h1>
              <p className="mt-3 text-base text-muted">
                Escolha uma senha com pelo menos 8 caracteres
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)

                      setPasswordError(null)
                    }}
                    placeholder="Mínimo de 8 caracteres"
                    className="pr-12"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={
                      passwordError ? "new-password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-ring"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id="new-password-error"
                    className="text-sm font-medium text-error"
                    role="alert"
                  >
                    {passwordError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-new-password">
                  Confirmar nova senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)

                      setConfirmError(null)
                    }}
                    placeholder="Digite a senha novamente"
                    className="pr-12"
                    aria-invalid={Boolean(confirmError)}
                    aria-describedby={
                      confirmError ? "confirm-new-password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-ring"
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showConfirmPassword}
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {confirmError && (
                  <p
                    id="confirm-new-password-error"
                    className="text-sm font-medium text-error"
                    role="alert"
                  >
                    {confirmError}
                  </p>
                )}
              </div>
              {formError && (
                <p className="text-sm font-medium text-error" role="alert">
                  {formError}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}
