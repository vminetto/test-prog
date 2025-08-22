import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, InputAdornment, TextField, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import JobCard from "./JobCard";
import EmptyState from "@/components/emptyState/EmptyState";
import type { Job } from "../types/types";
import type { DadosCandidatura } from "@/features/applications/types/types";

type Props = {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  onSearch: (q?: string) => void;
  onApply?: (id: number, data: DadosCandidatura) => Promise<void> | void;
  appliedJobIds?: number[];
};

export default function JobsTab({
  jobs, loading, error, onSearch, onApply, appliedJobIds = [],
}: Props) {
  const [q, setQ] = useState("");

  // evita disparar busca automática no primeiro render
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => onSearch(q.trim() || undefined), 300);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  const onChangeQ = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  }, []);

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q.trim() || undefined);
  }, [q, onSearch]);

  const skeletonCount = useMemo(() => Math.max(jobs?.length ?? 0, 2), [jobs]);

  const gridSx = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 2,
  }), []);

  const handleApply = useCallback(
    (id: number, data: DadosCandidatura) => onApply?.(id, data),
    [onApply]
  );

  return (
    <Box>
      <Box component="form" onSubmit={submit} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar vagas por título ou descrição..."
          value={q}
          onChange={onChangeQ}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading && (
        <Box sx={gridSx}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Box key={i} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="rectangular" height={48} />
            </Box>
          ))}
        </Box>
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          icon={<WorkOutlineIcon />}
          title="Nenhuma vaga encontrada"
          message={q ? "Tente ajustar sua busca ou limpar o filtro." : "Assim que houver vagas, elas aparecerão aqui."}
        />
      )}

      {!loading && !error && jobs.length > 0 && (
        <Box sx={gridSx}>
          {jobs.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              onApply={handleApply}
              isApplied={appliedJobIds.includes(j.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
