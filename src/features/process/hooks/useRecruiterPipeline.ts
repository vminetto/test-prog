import { useCallback, useEffect, useState } from "react";
import type { Application, Etapa } from "@/features/applications/types/types";

import { getPipelineByJob,moveApplicationTo } from "../api/pipeline";

export function useRecruiterPipeline(jobId?: number) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getPipelineByJob(jobId);
      setApps(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar pipeline");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const move = useCallback(async (applicationId: number, etapa: Etapa) => {
    try {
      setApps(prev => prev.map(a => (a.id === applicationId ? { ...a, etapa } : a)));
      await moveApplicationTo(applicationId, etapa);
    } catch (e) {
      await fetch();
      throw e;
    }
  }, [fetch]);

  useEffect(() => {
    if (jobId) fetch();
  }, [jobId, fetch]);

  return { apps, loading, error, fetch, move };
}
