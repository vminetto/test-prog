import { api } from "@/lib/axios";
import type { Application, DadosCandidatura, Etapa  } from "../types/types";

export const getMyApplications = () =>
api.get<Application[]>("/applications/me").then(r => r.data);

export const applyToJob = (jobId: number, dados: DadosCandidatura) =>
  api.post<Application>(`/jobs/${jobId}/apply`, dados).then(r => r.data);

export const cancelApplication = (id: number) =>
  api.delete<Application>(`/applications/${id}`).then(r => r.data);

export async function getCandidatesByJob(jobId: number): Promise<Application[]> {
  const { data } = await api.get(`/jobs/${jobId}/candidates`);
  return data;
}

export async function updateApplicationStage(appId: number, etapa: Etapa, note?: string): Promise<Application> {
  const { data } = await api.patch(`/applications/${appId}/stage`, { etapa, note });
  return data;
}