import { useCallback, useRef, useState } from "react";

import { getJobs, createJob, deleteJob } from "../api/api";
import type { Job, OwnerFilter } from "@/features/jobs/types/types";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastParamsRef = useRef<{ q?: string; owner?: OwnerFilter } | null>(null);

  const fetchJobs = useCallback(async (q?: string, owner: OwnerFilter = "all") => {
    const params = { q, owner };
    const same =
      lastParamsRef.current &&
      lastParamsRef.current.q === params.q &&
      lastParamsRef.current.owner === params.owner;
    if (same) return;

    lastParamsRef.current = params;
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs(params);
      setJobs(data);
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: string }).message)
          : "Erro inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Pick<Job, "title" | "description" | "location">) => {
    const job = await createJob(payload);
    setJobs((prev) => [job, ...prev]);
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  return { jobs, loading, error, fetchJobs, create, remove };
}
