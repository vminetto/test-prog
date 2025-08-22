import type { Application, Etapa } from "@/features/applications/types/types";
import { api } from "@/lib/axios";

export async function getPipelineByJob(jobId: number): Promise<Application[]> {
  const { data } = await api.get<Application[]>(`/jobs/${jobId}/candidates`);
  return data;
}

export async function moveApplicationTo(id: number, etapa: Etapa): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${id}/stage`, { etapa });
  return data;
}

export async function getMyApplications(): Promise<Application[]> {
  const { data } = await api.get<Application[]>(`/applications/me`);
  return data;
}
