import type { Etapa } from "@/features/applications/types/types";

export const pipeline_columns: {
  key: Etapa;
  title: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "error";
}[] = [
  { key: "triagem",            title: "Triagem",            color: "default"   },
  { key: "entrevista_tecnica", title: "Entrevista Técnica", color: "primary"   },
  { key: "cultural",           title: "Cultural",           color: "secondary" },
  { key: "oferta",             title: "Oferta",             color: "warning"   },
  { key: "contratado",         title: "Contratado",         color: "success"   },
  { key: "rejeitado",          title: "Rejeitado",          color: "error"     },
];
