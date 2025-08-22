import { useCallback, useMemo, useState } from "react";
import {
  Box, Button, Stack, TextField,
  InputAdornment, Skeleton
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmptyState from "@/components/emptyState/EmptyState";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import type { Job } from "../../jobs/types/types";

import MyJobCard from "./MyJobCard";

type Props = {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  onSearch: (q?: string) => void;
  onCreate: () => void;
  onDelete: (id: number) => void | Promise<void>;
};

export default function MyJobsTab({ jobs, loading, error, onSearch, onCreate, onDelete }: Props) {
  const [q, setQ] = useState("");
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q.trim() || undefined);
  }, [q, onSearch]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value), []);

  const gridSx = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 2,
  }), []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box component="form" onSubmit={submit} sx={{ flex: 1, mr: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar minhas vagas…"
            value={q}
            onChange={onChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
            }}
          />
        </Box>

        <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>
          Nova vaga
        </Button>
      </Stack>

      {loading && (
        <Box sx={gridSx}>
          {Array.from({ length: Math.max(jobs?.length ?? 0, 2) }).map((_, i) => (
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
          title="Você não criou nenhuma vaga"
          message={q ? "Tente ajustar sua busca ou limpar o filtro." : "Assim que houver vagas, elas aparecerão aqui."}
        />
      )}

      {!loading && !error && (
        <Box sx={gridSx}>
          {jobs.map((j) => (
            <MyJobCard key={j.id} job={j} onDelete={onDelete} />
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={!!jobToDelete}
        title="Excluir vaga"
        description={`Deseja realmente excluir a vaga "${jobToDelete?.title}"? Esta ação não poderá ser desfeita.`}
        onClose={() => setJobToDelete(null)}

        onConfirm={async () => {
          if (jobToDelete) {
            await onDelete(jobToDelete.id);
            setJobToDelete(null);
          }
        }}
      />
    </Box>
  );
}
