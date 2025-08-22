export type Etapa =
  | "triagem"
  | "entrevista_tecnica"
  | "cultural"
  | "oferta"
  | "contratado"
  | "rejeitado";

export type Application = {
  id: number;
  jobId: number;
  userId?: number;
  status: "candidatado" | "aprovado" | "rejeitado" | "em análise";
  etapa: Etapa;
  createdAt?: string;
  dados?: DadosCandidatura;
  historico?: Array<{ date: string; etapa: Etapa; note?: string }>;
};

export type ExperienciaTecnologia = { tecnologia: string; anos: number };

export type DadosCandidatura = {
  nome: string;
  telefone: string;
  modoTrabalho: "remoto" | "presencial" | "híbrido";
  experiencias: ExperienciaTecnologia[];
  curriculoUrl?: string;
};
