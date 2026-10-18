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

export type CategoriaMetaDatabase = "tecnica" | "comportamental";
export type StatusMetaDatabase = "nao_iniciada" | "em_andamento" | "concluida";
export type TipoCompetenciaDatabase = "hard" | "soft";

export interface MetaRow {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaMetaDatabase;
  prazo: string;
  progresso: number;
  status: StatusMetaDatabase;
}

export interface CompetenciaRow {
  id: string;
  nome: string;
  tipo: TipoCompetenciaDatabase;
  nivel: NivelCompetencia;
}

export function categoriaMetaFromDatabase(
  categoria: CategoriaMetaDatabase,
): CategoriaMeta {
  return categoria === "tecnica" ? "Técnica" : "Comportamental";
}

export function categoriaMetaToDatabase(
  categoria: CategoriaMeta,
): CategoriaMetaDatabase {
  return categoria === "Técnica" ? "tecnica" : "comportamental";
}

export function statusMetaFromDatabase(status: StatusMetaDatabase): StatusMeta {
  switch (status) {
    case "nao_iniciada":
      return "Não iniciada";
    case "em_andamento":
      return "Em andamento";
    case "concluida":
      return "Concluída";
  }
}

export function statusMetaToDatabase(status: StatusMeta): StatusMetaDatabase {
  switch (status) {
    case "Não iniciada":
      return "nao_iniciada";
    case "Em andamento":
      return "em_andamento";
    case "Concluída":
      return "concluida";
  }
}

export function tipoCompetenciaFromDatabase(
  tipo: TipoCompetenciaDatabase,
): TipoCompetencia {
  return tipo === "hard" ? "Hard skill" : "Soft skill";
}

export function tipoCompetenciaToDatabase(
  tipo: TipoCompetencia,
): TipoCompetenciaDatabase {
  return tipo === "Hard skill" ? "hard" : "soft";
}

export function metaFromDatabase(row: MetaRow): Meta {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    categoria: categoriaMetaFromDatabase(row.categoria),
    prazo: row.prazo,
    progresso: row.progresso,
    status: statusMetaFromDatabase(row.status),
  };
}

export function competenciaFromDatabase(row: CompetenciaRow): Competencia {
  return {
    id: row.id,
    nome: row.nome,
    tipo: tipoCompetenciaFromDatabase(row.tipo),
    nivel: row.nivel,
  };
}
