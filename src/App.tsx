import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { LoaderCircle } from "lucide-react"
import { supabase } from "./lib/supabase"
import CreateAccount from "./components/CreateAccount"
import ForgotPassword from "./components/ForgotPassword"
import Login from "./components/Login"
import Onboarding from "./components/Onboarding"
import Dashboard from "./components/Dashboard"
import UpdatePassword from "./components/UpdatePassword"
import {
  mapProfileToUserProfile,
  type ProfileRow,
  type UserProfile,
} from "./types/profile"

type Screen = "login" | "create-account" | "forgot-password" | "password-recovery" | "onboarding" | "dashboard"

export type { UserProfile } from "./types/profile"

export default function App() {
  const [screen, setScreen] = useState<Screen>("login")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [verificationAttempt, setVerificationAttempt] = useState(0)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      setSessionReady(true)
      setProfileError(null)
      setLogoutError(null)

      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true)
        setScreen("password-recovery")
      }

      if (nextSession) {
        setProfileLoading(true)
        setUserProfile(null)
      } else {
        setPasswordRecovery(false)
        setProfileLoading(false)
        setUserProfile(null)
        setScreen("login")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let active = true

    void supabase.auth.getSession().then(
      ({ data, error }) => {
        if (!active) return
        if (error) {
          setProfileError(
            "Não foi possível verificar sua sessão. Tente novamente.",
          )
          setSessionReady(true)
          return
        }

        setSession(data.session)
        setSessionReady(true)
        if (!data.session) setScreen("login")
      },
      () => {
        if (!active) return
        setProfileError(
          "Não foi possível verificar sua sessão. Tente novamente.",
        )
        setSessionReady(true)
      },
    )

    return () => {
      active = false
    }
  }, [verificationAttempt])

  useEffect(() => {
    if (!sessionReady || !session?.user.id || passwordRecovery) return

    let active = true
    setProfileLoading(true)
    setProfileError(null)

    void (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "id, nome, role, area, goals, team_size, onboarding_concluido, plano_iniciado_em",
          )
          .eq("id", session.user.id)
          .maybeSingle()

        if (!active) return

        if (error || !data) {
          setProfileError(
            error
              ? "Não foi possível carregar seu perfil. Tente novamente."
              : "Não encontramos seu perfil. Entre em contato com o suporte.",
          )
          setProfileLoading(false)
          return
        }

        const profile = data as ProfileRow
        if (profile.onboarding_concluido !== true) {
          setUserProfile(null)
          setScreen("onboarding")
        } else {
          setUserProfile(mapProfileToUserProfile(profile))
          setScreen("dashboard")
        }
        setProfileLoading(false)
      } catch {
        if (!active) return
        setProfileError(
          "Não foi possível carregar seu perfil. Tente novamente.",
        )
        setProfileLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [session?.user.id, sessionReady, verificationAttempt, passwordRecovery])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) return
      setLogoutError("Não foi possível encerrar sua sessão. Tente novamente.")
    } catch {
      setLogoutError("Não foi possível encerrar sua sessão. Tente novamente.")
    }
  }

  if (!sessionReady || (session && profileLoading && !passwordRecovery)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-muted">
        <div className="flex items-center gap-3" role="status">
          <LoaderCircle
            className="size-5 animate-spin text-accent"
            aria-hidden="true"
          />
          <span>Verificando sua sessão...</span>
        </div>
      </main>
    )
  }

  if (profileError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 text-center">
        <p className="max-w-md text-base text-error" role="alert">
          {profileError}
        </p>
        {logoutError && (
          <p className="max-w-md text-sm text-error" role="alert">
            {logoutError}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
            onClick={() => {
              setProfileError(null)
              setVerificationAttempt((attempt) => attempt + 1)
            }}
          >
            Tentar novamente
          </button>
          {session && (
            <button
              type="button"
              className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-text transition hover:bg-panel"
              onClick={handleLogout}
            >
              Sair
            </button>
          )}
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-bg font-sans">
      {logoutError && (
        <p
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-error px-4 py-3 text-sm font-medium text-white"
          role="alert"
        >
          {logoutError}
        </p>
      )}
      {screen === "login" && (
        <Login
          onCreateAccount={() => setScreen("create-account")}
          onForgotPassword={() => setScreen("forgot-password")}
        />
      )}
      {screen === "create-account" && (
        <CreateAccount onBackToLogin={() => setScreen("login")} />
      )}
      {screen === "forgot-password" && (
        <ForgotPassword onBackToLogin={() => setScreen("login")} />
      )}
      {screen === "password-recovery" && session && (
        <UpdatePassword
          onContinue={() => {
            setPasswordRecovery(false)
            setProfileLoading(true)
          }}
        />
      )}
      {screen === "onboarding" && (
        <Onboarding
          onComplete={async (profile) => {
            if (!session?.user.id) {
              throw new Error(
                "Sua sessão expirou. Entre novamente para continuar.",
              )
            }

            const today = new Date()
            const planStartedOn = [
              today.getFullYear(),
              String(today.getMonth() + 1).padStart(2, "0"),
              String(today.getDate()).padStart(2, "0"),
            ].join("-")

            const { data, error } = await supabase
              .from("profiles")
              .update({
                nome: profile.name,
                role: profile.role,
                area: profile.area,
                goals: profile.goals,
                team_size: profile.teamSize,
                onboarding_concluido: true,
                plano_iniciado_em: planStartedOn,
              })
              .eq("id", session.user.id)
              .select(
                "id, nome, role, area, goals, team_size, onboarding_concluido, plano_iniciado_em",
              )
              .single()

            if (error || !data) {
              throw new Error(
                "Não foi possível salvar suas respostas. Tente novamente.",
              )
            }

            const savedProfile = data as ProfileRow
            setUserProfile(mapProfileToUserProfile(savedProfile))
            setScreen("dashboard")
            return savedProfile
          }}
        />
      )}
      {screen === "dashboard" && userProfile && (
        <Dashboard userProfile={userProfile} onLogout={handleLogout} />
      )}
    </div>
  )
}
