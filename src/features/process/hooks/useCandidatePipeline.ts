import { useApplications } from "@/features/applications/hooks/useApplications";
export function useCandidatePipeline() {
  const { apps, loading, error, fetchApps: fetch } = useApplications();
  return { apps, loading, error, fetch };
}
