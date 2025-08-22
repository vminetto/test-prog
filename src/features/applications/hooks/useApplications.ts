import { useCallback, useState } from "react";
import { getMyApplications, applyToJob, cancelApplication } from "../api/api";
import type { Application, DadosCandidatura } from "@/features/applications/types/types";

export function useApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getMyApplications();
      setApps(data ?? []);
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

  const apply = useCallback(async (jobId: number, dados: DadosCandidatura) => {
    const created = await applyToJob(jobId, dados);
    setApps(prev => {
      const filtered = prev.filter(a => !(a.jobId === created.jobId && a.id === created.id));
      return [created, ...filtered];
    });
    return created;
  }, []);

  const cancel = useCallback(async (appId: number) => {
    setError(null);
    await cancelApplication(appId);
    setApps((prev) => prev.filter((a) => a.id !== appId));
  }, []);

  return { apps, loading, error, fetchApps, apply, cancel, setApps };
}
