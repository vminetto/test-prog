export type User = { id: number; email: string; password: string };
export type SafeUser = { id: number; email: string };
export type Etapa =
  | "triagem"
  | "entrevista_tecnica"
  | "cultural"
  | "oferta"
  | "contratado"
  | "rejeitado";
