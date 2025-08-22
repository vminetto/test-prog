import { alpha, Box, Card, Chip, Stack, Typography } from "@mui/material";
import CandidateCard from "./CandidateCard";
import type { Application } from "@/features/applications/types/types";

type Props = {
  title: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  apps: Application[];
  count: number;
  disablePrev?: boolean;
  disableNext?: boolean;
  onMovePrev?: (id: number) => void;
  onMoveNext?: (id: number) => void;
  onHire?: (id: number) => void;
  onReject?: (id: number) => void;
};

export default function PipelineColumn({
  title, color, apps, count, disablePrev, disableNext, onMovePrev, onMoveNext, onHire, onReject,
}: Props) {
  return (
    <Card variant="outlined" sx={{
      borderRadius: 3, overflow: "hidden", borderColor: "divider",
      transition: "box-shadow .2s ease",
      "&:hover": { boxShadow: theme => `0 6px 18px ${alpha(theme.palette.common.black, 0.08)}` },
    }}>
      <Box sx={{
        position: "sticky", top: 0, zIndex: 1, px: 2, py: 1.25,
        bgcolor: theme => alpha(theme.palette.background.paper, 0.9),
        backdropFilter: "saturate(180%) blur(6px)", borderBottom: 1, borderColor: "divider",
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{title}</Typography>
          <Chip size="small" color={color === "default" ? "default" : color} label={count} />
        </Stack>
      </Box>

      <Box sx={{ p: 1.5, minHeight: 120 }}>
        {apps.length === 0 ? (
          <Box sx={{ p: 2, borderRadius: 2, border: "1px dashed", borderColor: "divider", color: "text.secondary", textAlign: "center", fontSize: 13 }}>
            Nenhum candidato nesta etapa
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {apps.map(a => (
              <CandidateCard
                key={a.id}
                id={a.id}
                name={a.dados?.nome ?? "Candidato"}
                createdAt={a.createdAt}
                onMovePrev={onMovePrev ? () => onMovePrev(a.id) : undefined}
                onMoveNext={onMoveNext ? () => onMoveNext(a.id) : undefined}
                onHire={onHire ? () => onHire(a.id) : undefined}
                onReject={onReject ? () => onReject(a.id) : undefined}
                disablePrev={disablePrev}
                disableNext={disableNext}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
}
