import { useState, memo } from "react";
import {
  Card, CardContent, CardActions, Typography, Button, Stack, Box, Tooltip
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import type { Job } from "../types/types";
import ApplyJobDialog from "@/features/applications/components/ApplyJobDialog";
import type { DadosCandidatura } from "@/features/applications/types/types";

type Props = {
  job: Job;
  onApply?: (id: number, data: DadosCandidatura) => Promise<void> | void;
  actions?: React.ReactNode;
  isApplied?: boolean;
};

function JobCard({ job, onApply, actions, isApplied = false }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleOpenDialog = () => {
    if (!isApplied) setIsOpen(true);
  };

  const handleSubmitDialog = async (dados: DadosCandidatura) => {
    if (!onApply) {
      setIsOpen(false);
      return;
    }
    try {
      setIsApplying(true);
      await onApply(job.id, dados);
      setIsOpen(false);
    } finally {
      setIsApplying(false);
    }
  };

  const defaultActions = isApplied ? (
    <Tooltip title="Você já enviou sua candidatura para esta vaga">
      <span>
        <Button
          size="small"
          variant="outlined"
          color="success"
          startIcon={<TaskAltIcon />}
          disabled
        >
          Candidatura enviada
        </Button>
      </span>
    </Tooltip>
  ) : (
    <Button
      size="small"
      variant="contained"
      onClick={handleOpenDialog}
      disabled={isApplying}
    >
      {isApplying ? "Enviando..." : "Candidatar-se"}
    </Button>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        borderColor: "divider",
        boxShadow: "none",
        "&:hover": { borderColor: "primary.light", bgcolor: "background.paper" }
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <WorkOutlineIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {job.title}
          </Typography>
        </Stack>

        <Box
          component="span"
          sx={{
            fontSize: 12, px: 1, py: 0.25, borderRadius: 1.5,
            bgcolor: "rgba(124,58,237,0.08)", color: "primary.main",
            border: "1px solid rgba(124,58,237,0.25)", display: "inline-block", mb: 1
          }}
        >
          {job.location || "Remoto"}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {job.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1.5 }}>
        {actions ?? defaultActions}
      </CardActions>

      <ApplyJobDialog
        open={isOpen}
        job={job}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmitDialog}
      />
    </Card>
  );
}

export default memo(JobCard);
