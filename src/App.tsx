import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { LoaderCircle } from "lucide-react"
import { supabase } from "./lib/supabase"
import CreateAccount from "./components/CreateAccount"
import Login from "./components/Login"
import Onboarding from "./components/Onboarding"
import Dashboard from "./components/Dashboard"

type Screen = "login" | "create-account" | "onboarding" | "dashboard"

export interface UserProfile {
  name: string
  role: string
  area: string
  goals: string[]
  teamSize: string
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [verificationAttempt, setVerificationAttempt] = useState(0)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setSessionReady(true)
      setProfileError(null)
      setLogoutError(null)

      if (nextSession) {
        setProfileLoading(true)
        setUserProfile(null)
      } else {
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
    if (!sessionReady || !session?.user.id) return

    let active = true
    setProfileLoading(true)
    setProfileError(null)

    void (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("nome, role, area, goals, team_size, onboarding_concluido")
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

        if (data.onboarding_concluido !== true) {
          setUserProfile(null)
          setScreen("onboarding")
        } else {
          setUserProfile({
            name: typeof data.nome === "string" ? data.nome : "",
            role: typeof data.role === "string" ? data.role : "",
            area: typeof data.area === "string" ? data.area : "",
            goals: Array.isArray(data.goals)
              ? data.goals.filter(
                  (goal): goal is string => typeof goal === "string",
                )
              : [],
            teamSize: typeof data.team_size === "string" ? data.team_size : "",
          })
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
  }, [session?.user.id, sessionReady, verificationAttempt])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) return
      setLogoutError("Não foi possível encerrar sua sessão. Tente novamente.")
    } catch {
      setLogoutError("Não foi possível encerrar sua sessão. Tente novamente.")
    }
  }

  if (!sessionReady || (session && profileLoading)) {
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
        <Login onCreateAccount={() => setScreen("create-account")} />
      )}
      {screen === "create-account" && (
        <CreateAccount onBackToLogin={() => setScreen("login")} />
      )}
      {screen === "onboarding" && (
        <Onboarding
          onComplete={(profile) => {
            setUserProfile(profile)
            setScreen("dashboard")
          }}
        />
      )}
      {screen === "dashboard" && userProfile && (
        <Dashboard userProfile={userProfile} onLogout={handleLogout} />
      )}
    </div>
  )
}
