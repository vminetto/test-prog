import { api } from "@/lib/axios";
import type { Job } from "../types/types";


export async function getJobs(params?: { q?: string; owner?: "me" | "others" | "all" }) {
  const response = await api.get<Job[]>("/jobs", { params });
  return response.data;
}

export const getJob = (id: string | number) =>
api.get<Job>(`/jobs/${id}`).then(r => r.data);


export const createJob = (payload: Pick<Job, "title"|"description"|"location">) =>
api.post<Job>("/jobs", payload).then(r => r.data);

export async function deleteJob(id: number): Promise<void> {
  await api.delete(`/jobs/${id}`);
}