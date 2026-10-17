import LoginForm from "./LoginForm"

interface Props {
  onCreateAccount: () => void
  onForgotPassword: () => void
}

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

export default function Login({ onCreateAccount, onForgotPassword }: Props) {
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

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2" aria-hidden="true">
            <span className="size-9 rounded-full border-2 border-panel bg-circle-orange" />
            <span className="size-9 rounded-full border-2 border-panel bg-circle-green" />
            <span className="size-9 rounded-full border-2 border-panel bg-accent" />
          </div>
          <p className="text-sm font-medium text-panel-muted">
            Projeto de Extensão Unifametro
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-14 lg:hidden">
            <Brand />
          </div>

          <div className="mb-9">
            <p className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Bem-vindo de volta
            </p>
            <p className="mt-3 text-base text-muted">
              Entre na sua conta para continuar
            </p>
          </div>

          <LoginForm onForgotPassword={onForgotPassword} />

          <p className="mt-9 text-center text-sm text-muted">
            Não tem uma conta?{" "}
            <button
              type="button"
              className="rounded-sm font-semibold text-accent-dark transition hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-ring"
              onClick={onCreateAccount}
            >
              Criar conta
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}
