import { useCallback, useRef, useState } from "react";

import { getJobs, createJob, deleteJob } from "@/features/jobs/api/api";
import type { Job } from "@/features/jobs/types/types";

export function useMyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastQuery = useRef<string | undefined>(undefined);

  const fetchMyJobs = useCallback(async (q?: string) => {

    if (lastQuery.current === (q || undefined) && jobs.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getJobs({ q, owner: "me" });
      setJobs(data);
      lastQuery.current = q || undefined;
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: string }).message)
          : "Erro inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [jobs.length]);

  const create = useCallback(async (payload: Pick<Job, "title" | "description" | "location">) => {
    const job = await createJob(payload);
    setJobs(prev => [job, ...prev]);
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  return { jobs, loading, error, fetchMyJobs, create, remove };
}
