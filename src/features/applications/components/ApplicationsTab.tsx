import { useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Skeleton, Stack, Tooltip, Typography,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import type { Application } from "../types/types";
import EmptyState from "@/components/emptyState/EmptyState";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

type Props = {
  apps: Application[];
  loading: boolean;
  error: string | null;
  onCancel: (id: number) => Promise<void> | void;
};

export default function ApplicationsTab({ apps, loading, error, onCancel }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (loading) {
    return (
      <Stack spacing={2}>
        {[0, 1, 2].map((i) => (
          <Card key={i} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="rounded" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="30%" height={20} />
                <Skeleton width="18%" height={16} sx={{ mt: 1 }} />
              </Box>
              <Skeleton width={120} height={32} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (apps.length === 0) {
    return (
      <EmptyState
        icon={<WorkOutlineIcon />}
        title="Sem candidaturas ainda"
        message="Quando você se candidatar a uma vaga, ela aparecerá aqui."
      />
    );
  }

  const labelStatus = (s?: string) => {
    if (!s) return "—";
    if (s === "candidatado") return "Candidatado";
    if (s === "aprovado") return "Aprovado";
    if (s === "rejeitado") return "Rejeitado";
    if (s === "em análise" || s === "review") return "Em análise";
    return s;
  };

  return (
    <>
      <Stack spacing={2}>
        {apps.map((a) => {
          const dateLabel = a.createdAt
            ? new Date(a.createdAt).toLocaleString("pt-BR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })
            : "";

          const isPending = pendingId === a.id;

          return (
            <Card
              key={a.id}
              variant="outlined"
              sx={{ borderRadius: 3, "&:hover": { boxShadow: 4 } }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle1">Vaga #{a.jobId}</Typography>
                  <Chip size="small" label={labelStatus(a.status)} color="primary" sx={{ mt: 0.5 }} />
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Tooltip title={dateLabel}>
                    <Typography variant="caption" color="text.secondary">
                      {dateLabel}
                    </Typography>
                  </Tooltip>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => { setSelectedId(a.id); setDialogOpen(true); }}
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={16} /> : undefined}
                  >
                    {isPending ? "Cancelando..." : "Cancelar"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <ConfirmDialog
        open={dialogOpen}
        title="Cancelar candidatura"
        description="Tem certeza que deseja cancelar sua candidatura? Essa ação não pode ser desfeita."
        cancelText="Voltar"
        variant="destructive"
        loading={pendingId !== null}
        onClose={() => { setDialogOpen(false); setSelectedId(null); }}
        onConfirm={async () => {
          if (!selectedId) return;
          try {
            setPendingId(selectedId);
            await onCancel(selectedId);
          } finally {
            setPendingId(null);
            setDialogOpen(false);
            setSelectedId(null);
          }
        }}
      />
    </>
  );
}
