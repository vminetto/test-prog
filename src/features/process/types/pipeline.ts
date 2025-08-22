import type { Etapa } from "@/features/applications/types/types";

export type PipelineColumn = {
  key: Etapa;
  title: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "error";
};
