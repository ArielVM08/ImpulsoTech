export type CategoriaMeta = "Técnica" | "Comportamental";
export type StatusMeta = "Não iniciada" | "Em andamento" | "Concluída";

export interface Meta {
  id: string;
  titulo: string;
  categoria: CategoriaMeta;
  prazo: string;
  descricao: string;
  progresso: number;
  status: StatusMeta;
}

export type TipoCompetencia = "Hard skill" | "Soft skill";
export type NivelCompetencia = 1 | 2 | 3 | 4 | 5;

export interface Competencia {
  id: string;
  nome: string;
  tipo: TipoCompetencia;
  nivel: NivelCompetencia;
}
