import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useAuth } from "@/features/auth";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { useMyJobs } from "@/features/myjobs/hooks/useMyJobs";
import { useApplications } from "@/features/applications/hooks/useApplications";

import JobsTab from "@/features/jobs/components/JobsTab";
import ApplicationsTab from "@/features/applications/components/ApplicationsTab";
import MyJobsTab from "@/features/myjobs/components/MyJobTabs";
import ProcessTab from "@/features/process/components/ProcessTab";

import type { Application, DadosCandidatura } from "@/features/applications/types/types";

const CreateJobDialog = lazy(() => import("@/features/jobs/components/CreateJobDialog"));

type TabKey = "jobs" | "myjobs" | "apps" | "process";

export default function DashboardPage() {
  const { isAuthenticated, bootstrapped } = useAuth();

  const {
    jobs: othersJobs,
    loading: othersLoading,
    error: othersError,
    fetchJobs: fetchOthers,
  } = useJobs();

  const {
    jobs: myJobs,
    loading: myLoading,
    error: myError,
    fetchMyJobs,
    create: createMyJob,
    remove: removeMyJob,
  } = useMyJobs();

  const { apps, loading: appsLoading, error: appsError, fetchApps, apply, cancel } = useApplications();

  const [tab, setTab] = useState<TabKey>("jobs");
  const [openCreate, setOpenCreate] = useState(false);

  const searchOthers = useCallback((q?: string) => fetchOthers(q, "others"), [fetchOthers]);
  const searchMine = useCallback((q?: string) => fetchMyJobs(q), [fetchMyJobs]);

  useEffect(() => {
    if (!bootstrapped || !isAuthenticated) return;
    fetchOthers(undefined, "others");
    fetchApps();
  }, [bootstrapped, isAuthenticated, fetchOthers, fetchApps]);

  const myLoadedOnce = useRef(false);
  useEffect(() => {
    if (tab === "myjobs" && !myLoadedOnce.current) {
      fetchMyJobs();
      myLoadedOnce.current = true;
    }
  }, [tab, fetchMyJobs]);

  const appliedJobIds = useMemo<number[]>(() => {
    if (!apps) return [];
    return apps
      .map((a: Application) => a.jobId ?? a.jobId)
      .filter((id): id is number => typeof id === "number");
  }, [apps]);

  return (
    <>
      <Tabs value={tab} onChange={(_, v) => setTab(v as TabKey)} variant="fullWidth" sx={{ mb: 3 }}>
        <Tab value="jobs" icon={<WorkOutlineIcon sx={{ mr: 1 }} />} iconPosition="start" label="Vagas" />
        <Tab value="apps" icon={<TaskAltIcon sx={{ mr: 1 }} />} iconPosition="start" label="Minhas candidaturas" />
        <Tab value="myjobs" icon={<WorkOutlineIcon sx={{ mr: 1 }} />} iconPosition="start" label="Minhas vagas" />
        <Tab value="process" icon={<TaskAltIcon sx={{ mr: 1 }} />} iconPosition="start" label="Processos" />
      </Tabs>

      {tab === "jobs" && (
        <JobsTab
          jobs={othersJobs}
          loading={othersLoading}
          error={othersError}
          onSearch={searchOthers}
          onApply={async (id: number, dados: DadosCandidatura) => {
            await apply(id, dados);
          }}
          appliedJobIds={appliedJobIds}
        />
      )}

      {tab === "apps" && (
        <ApplicationsTab
          apps={apps}
          loading={appsLoading}
          error={appsError}
          onCancel={async (applicationId) => { await cancel(applicationId); }}
        />
      )}

      {tab === "myjobs" && (
        <MyJobsTab
          jobs={myJobs}
          loading={myLoading}
          error={myError}
          onSearch={searchMine}
          onCreate={() => setOpenCreate(true)}
          onDelete={async (id) => removeMyJob(id)}
        />
      )}

      {tab === "process" && (
        <ProcessTab myJobs={myJobs} myApplications={apps ?? []} />
      )}

      <Suspense fallback={null}>
        {openCreate && (
          <CreateJobDialog
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={async (payload) => {
              await createMyJob(payload);
              setOpenCreate(false);
              await fetchMyJobs();
            }}
          />
        )}
      </Suspense>
    </>
  );
}
