import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Stack,
    Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { api } from "@/lib/axios";
import type { Job } from "../../jobs/types/types";

type Props = {
    job: Job;
    onDelete: (id: number) => Promise<void> | void;
};

export default function MyJobCard({ job, onDelete }: Props) {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [candidateCount, setCandidateCount] = useState<number>(0);

    useEffect(() => {
        let active = true;
        async function fetchCandidates() {
            try {
                const res = await api.get(`/jobs/${job.id}/candidates`);
                if (active) setCandidateCount(res.data.length);
            } catch {
                if (active) setCandidateCount(0);
            }
        }
        fetchCandidates();
        return () => {
            active = false;
        };
    }, [job.id]);

    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    "&:hover": { boxShadow: 3 },
                }}
            >
                <CardContent>
                    <Stack direction="row" alignItems="start" justifyContent="space-between">
                        <Stack spacing={0.5}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {job.location || "—"}
                            </Typography>
                        </Stack>
                        <Chip
                            size="small"
                            icon={<PeopleAltIcon />}
                            label={`${candidateCount} candidato(s)`}
                            color="secondary"
                            variant="outlined"
                        />
                    </Stack>

                    <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                        {job.description}
                    </Typography>


                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setOpenConfirm(true)}
                    >
                        Excluir
                    </Button>
                </CardActions>
            </Card>

            {/* Modal de confirmação */}
            <ConfirmDialog
                open={openConfirm}
                title="Excluir vaga"
                description={`Tem certeza que deseja excluir a vaga "${job.title}"?`}
                variant="destructive"
                onClose={() => setOpenConfirm(false)}
                onConfirm={async () => {
                    await onDelete(job.id);
                    setOpenConfirm(false);
                }}
            />
        </>
    );
}
