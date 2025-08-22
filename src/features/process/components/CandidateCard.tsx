import { alpha, Avatar, Card, CardContent, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function initials(name?: string) {
  if (!name) return "C";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "C";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = {
  id: number;
  name: string;
  createdAt?: string;
  disablePrev?: boolean;
  disableNext?: boolean;
  onMovePrev?: () => void;
  onMoveNext?: () => void;
  onHire?: () => void;
  onReject?: () => void;
};

export default function CandidateCard({
  id, name, createdAt, onMovePrev, onMoveNext, onHire, onReject, disablePrev, disableNext,
}: Props) {
  return (
    <Card elevation={0} variant="outlined" sx={{
      borderRadius: 2,
      transition: "transform .15s ease, border-color .15s ease",
      "&:hover": { transform: "translateY(-2px)", borderColor: theme => alpha(theme.palette.primary.main, 0.3) },
    }}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{initials(name)}</Avatar>
          <div style={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>#{id} — {name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "—"}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
          <Tooltip title="Voltar etapa">
            <span>
              <IconButton size="small" onClick={onMovePrev} disabled={!!disablePrev || !onMovePrev}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Avançar etapa">
            <span>
              <IconButton size="small" onClick={onMoveNext} disabled={!!disableNext || !onMoveNext}>
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <div style={{ flex: 1 }} />

          <Tooltip title="Marcar como contratado">
            <span>
              <IconButton size="small" color="success" onClick={onHire} disabled={!onHire}>
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Rejeitar candidato">
            <span>
              <IconButton size="small" color="error" onClick={onReject} disabled={!onReject}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
