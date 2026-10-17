export function translateAuthError(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar."
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "E-mail ou senha incorretos."
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "Já existe uma conta com este e-mail."
  }

  if (
    normalized.includes("password should be at least") ||
    normalized.includes("password is too weak")
  ) {
    return "A senha deve ter pelo menos 8 caracteres."
  }

  if (normalized.includes("unable to validate email address")) {
    return "Digite um e-mail válido."
  }

  if (normalized.includes("too many requests")) {
    return "Muitas tentativas. Aguarde um pouco e tente novamente."
  }

  return "Não foi possível concluir a solicitação. Tente novamente."
}
