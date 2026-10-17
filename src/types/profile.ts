export interface UserProfile {
  name: string

  role: string

  area: string

  goals: string[]

  teamSize: string
}

export interface ProfileRow {
  id: string

  nome: string

  role: string

  area: string

  goals: string[]

  team_size: string

  onboarding_concluido: boolean

  plano_iniciado_em: string | null
}

export function mapProfileToUserProfile(profile: ProfileRow): UserProfile {
  return {
    name: profile.nome,

    role: profile.role,

    area: profile.area,

    goals: profile.goals,

    teamSize: profile.team_size,
  }
}
