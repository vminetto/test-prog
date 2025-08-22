import { useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CircularProgress, Divider, MenuItem, Select,
  Stack, Tab, Tabs, Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SelectChangeEvent } from "@mui/material/Select";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FilterListIcon from "@mui/icons-material/FilterList";

import type { Job } from "@/features/jobs/types/types";
import type { Application, Etapa } from "@/features/applications/types/types";
import { useRecruiterPipeline } from "@/features/process/hooks/useRecruiterPipeline";
import PipelineColumn from "./PipelineColumn";
import { pipeline_columns } from "../constants/columns";

type Mode = "recruiter" | "candidate";

type Props = {
  myJobs: Job[];
  myApplications: Application[];
};

export default function ProcessTab({ myJobs, myApplications }: Props) {
  const [mode, setMode] = useState<Mode>("recruiter");

  const [jobId, setJobId] = useState<number | "">("");
  const { apps: recruiterApps, loading, error, move } =
    useRecruiterPipeline(typeof jobId === "number" ? jobId : undefined);

  const [candidateJobId, setCandidateJobId] = useState<number | "">("");

  const candidateJobs = useMemo(() => {
    const map = new Map<number, string>();
    (myApplications ?? []).forEach((a) => {
      const id = a.jobId;
      if (typeof id !== "number") return;
      if (!map.has(id)) {
        const title = myJobs.find((j) => j.id === id)?.title ?? `Vaga #${id}`;
        map.set(id, title);
      }
    });
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [myApplications, myJobs]);

  const myAppsForSelectedJob = useMemo(
    () =>
      (myApplications ?? []).filter((a) =>
        typeof candidateJobId === "number" ? a.jobId === candidateJobId : false
      ),
    [myApplications, candidateJobId]
  );

  const groupByEtapa = (list: Application[] | undefined) => {
    const m = new Map<Etapa, Application[]>();
    pipeline_columns.forEach((c) => m.set(c.key, []));
    (list || []).forEach((a) => m.get(a.etapa)?.push(a));
    return m;
  };

  const recruiterGrouped = useMemo(() => groupByEtapa(recruiterApps), [recruiterApps]);
  const candidateGrouped = useMemo(() => groupByEtapa(myAppsForSelectedJob), [myAppsForSelectedJob]);

  const handleRecruiterJobChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    setJobId(val === "" ? "" : Number(val));
  };

  const handleCandidateJobChange = (e: SelectChangeEvent) => {
    const val = e.target.value;
    setCandidateJobId(val === "" ? "" : Number(val));
  };

  const renderGrid = (lists: Map<Etapa, Application[]>, canMove: boolean) => (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        alignItems: "start",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(260px, 1fr))",
          md: "repeat(3, minmax(260px, 1fr))",
          lg: "repeat(6, minmax(220px, 1fr))",
        },
      }}
    >
      {pipeline_columns.map((col, idx) => {
        const list = lists.get(col.key) || [];
        const onPrev =
          canMove && idx > 0 ? (id: number) => move(id, pipeline_columns[idx - 1].key) : undefined;
        const onNext =
          canMove && idx < pipeline_columns.length - 1
            ? (id: number) => move(id, pipeline_columns[idx + 1].key)
            : undefined;
        const onHire = canMove ? (id: number) => move(id, "contratado") : undefined;
        const onReject = canMove ? (id: number) => move(id, "rejeitado") : undefined;

        return (
          <PipelineColumn
            key={col.key}
            title={col.title}
            color={col.color}
            apps={list}
            count={list.length}
            disablePrev={!onPrev}
            disableNext={!onNext}
            onMovePrev={onPrev}
            onMoveNext={onNext}
            onHire={onHire}
            onReject={onReject}
          />
        );
      })}
    </Box>
  );

  return (
    <Box>
      <Tabs value={mode} onChange={(_, v) => setMode(v as Mode)} sx={{ mb: 2 }} variant="fullWidth">
        <Tab
          value="recruiter"
          label="Sou recrutador"
          icon={<WorkOutlineIcon sx={{ mr: 1 }} />}
          iconPosition="start"
        />
        <Tab
          value="candidate"
          label="Sou candidato"
          icon={<TaskAltIcon sx={{ mr: 1 }} />}
          iconPosition="start"
        />
      </Tabs>

      {mode === "recruiter" && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            px: 2,
            py: 1.5,
            backdropFilter: "saturate(180%) blur(6px)",
            background: (theme) =>
              `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.035)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <WorkOutlineIcon fontSize="small" />
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Pipeline das minhas vagas
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="text.secondary">
              Selecione a vaga:
            </Typography>
            <Select
              size="small"
              value={jobId === "" ? "" : String(jobId)}
              onChange={handleRecruiterJobChange}
              displayEmpty
              sx={{ minWidth: 260, borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>— Selecione uma vaga criada por você —</em>
              </MenuItem>
              {myJobs.map((j) => (
                <MenuItem key={j.id} value={String(j.id)}>
                  {j.title}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ flex: 1 }} />
            <Button variant="outlined" size="small" startIcon={<FilterListIcon />} disabled sx={{ borderRadius: 2 }}>
              Filtros
            </Button>
          </Stack>
        </Card>
      )}

      {mode === "recruiter" && !jobId && <Alert severity="info">Escolha uma vaga (sua) para visualizar o pipeline.</Alert>}
      {mode === "recruiter" && error && <Alert severity="error">{error}</Alert>}
      {mode === "recruiter" && jobId && loading && (
        <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {mode === "recruiter" && jobId && !loading && !error && renderGrid(recruiterGrouped, true)}

      {mode === "candidate" && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            px: 2,
            py: 1.5,
            backdropFilter: "saturate(180%) blur(6px)",
            background: (theme) =>
              `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.035)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <TaskAltIcon fontSize="small" />
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Minhas candidaturas
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" color="text.secondary">
              Selecione a vaga que você se candidatou:
            </Typography>
            <Select
              size="small"
              value={candidateJobId === "" ? "" : String(candidateJobId)}
              onChange={handleCandidateJobChange}
              displayEmpty
              sx={{ minWidth: 260, borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>— Selecione uma vaga em que você está participando —</em>
              </MenuItem>
              {candidateJobs.map((j) => (
                <MenuItem key={j.id} value={String(j.id)}>
                  {j.title}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Card>
      )}

      {mode === "candidate" && !candidateJobId && (
        <Alert severity="info">Escolha uma das vagas em que você se candidatou para acompanhar as etapas.</Alert>
      )}
      {mode === "candidate" && candidateJobId && myAppsForSelectedJob.length === 0 && (
        <Alert severity="warning">Não há registros de etapas ainda para esta vaga.</Alert>
      )}
      {mode === "candidate" && candidateJobId && myAppsForSelectedJob.length > 0 && renderGrid(candidateGrouped, false)}
    </Box>
  );
}
