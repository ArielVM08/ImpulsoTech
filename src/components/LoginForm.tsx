import { useState } from "react"
import { supabase } from "../lib/supabase"
import Button from "./ui/button"
import Input from "./ui/input"
import Label from "./ui/label"

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail."
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Digite um e-mail válido."
    }

    if (!password) {
      nextErrors.password = "Informe sua senha."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors((current) => ({ ...current, form: undefined }))
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        setErrors((current) => ({
          ...current,
          form: "E-mail ou senha incorretos.",
        }))
      }
    } catch {
      setErrors((current) => ({
        ...current,
        form: "Não foi possível entrar. Verifique sua conexão e tente novamente.",
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (errors.email)
              setErrors((current) => ({ ...current, email: undefined }))
          }}
          placeholder="voce@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-sm font-medium text-error"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Senha</Label>
          <a
            href="#"
            className="rounded-sm text-sm font-medium text-accent-dark transition hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-ring"
            onClick={(event) => event.preventDefault()}
          >
            Esqueceu a senha?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password)
              setErrors((current) => ({ ...current, password: undefined }))
          }}
          placeholder="Digite sua senha"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p
            id="password-error"
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
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
}
