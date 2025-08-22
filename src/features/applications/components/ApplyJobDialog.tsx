import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Typography, InputLabel, FormControl,
  Select, Chip, Stack, Button, CircularProgress,
} from "@mui/material";
import type { Job } from "@/features/jobs/types/types";
import type { DadosCandidatura, ExperienciaTecnologia } from "@/features/applications/types/types";

const phoneRegex = /^\+?\d{10,15}$/;

const fileSchema =
  typeof File !== "undefined"
    ? z.instanceof(File)
    : z.any();

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome completo"),
  telefone: z.string().regex(phoneRegex, "Telefone inválido"),
  modoTrabalho: z.enum(["remoto", "presencial", "híbrido"]),
  experiencias: z.array(
    z.object({
      tecnologia: z.string(),
      anos: z.number().min(0, "Mínimo 0").max(50, "Máximo 50"),
    })
  ).min(1, "Informe ao menos uma tecnologia"),
  curriculoFile: fileSchema.optional(),
});

type FormValues = z.infer<typeof schema>;

function tecnologiasSugeridas(job: Job | null): string[] {
  if (!job) return [];
  const t = (job.title + " " + (job.description || "")).toLowerCase();
  if (t.includes("front")) return ["React", "TypeScript", "Vite"];
  if (t.includes("go") || t.includes("backend")) return ["Go", "Gin", "GORM", "Postgres"];
  return ["Comunicação", "Algoritmos"];
}

type Props = {
  open: boolean;
  job: Job | null;
  onClose: () => void;
  onSubmit: (dados: DadosCandidatura) => Promise<void> | void;
};

export default function ApplyJobDialog({ open, job, onClose, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const techs = useMemo(() => tecnologiasSugeridas(job), [job]);

  const {
    register, control, handleSubmit, setValue, reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      telefone: "",
      modoTrabalho: "remoto",
      experiencias: techs.map<ExperienciaTecnologia>((tec) => ({ tecnologia: tec, anos: 0 })),
      curriculoFile: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      nome: "",
      telefone: "",
      modoTrabalho: "remoto",
      experiencias: techs.map<ExperienciaTecnologia>((tec) => ({ tecnologia: tec, anos: 0 })),
      curriculoFile: undefined,
    });
  }, [open, techs, reset]);

  const curriculoFile = watch("curriculoFile");
  const loading = submitting || isSubmitting;

  const onValidSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      let curriculoUrl: string | undefined;
      const f = values.curriculoFile as File | undefined;
      if (f) curriculoUrl = URL.createObjectURL(f);

      const payload: DadosCandidatura = {
        nome: values.nome,
        telefone: values.telefone,
        modoTrabalho: values.modoTrabalho,
        experiencias: values.experiencias,
        curriculoUrl,
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Candidatura {job ? `— ${job.title}` : ""}</DialogTitle>

      <DialogContent dividers>
        <Box
          id="apply-form"
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onValidSubmit)}
        >
          {/* Linha nome + telefone */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <TextField
              label="Nome completo"
              fullWidth
              {...register("nome")}
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
            <TextField
              label="Telefone (com DDD)"
              placeholder="+5511999999999"
              fullWidth
              {...register("telefone")}
              error={!!errors.telefone}
              helperText={errors.telefone?.message}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
            <FormControl fullWidth>
              <InputLabel id="modo-label">Modo de trabalho</InputLabel>
              <Controller
                control={control}
                name="modoTrabalho"
                render={({ field }) => (
                  <Select labelId="modo-label" label="Modo de trabalho" {...field}>
                    <MenuItem value="remoto">Remoto</MenuItem>
                    <MenuItem value="presencial">Presencial</MenuItem>
                    <MenuItem value="híbrido">Híbrido</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            <Button component="label" variant="outlined" fullWidth disabled={loading}>
              {curriculoFile instanceof File ? `Currículo: ${curriculoFile.name}` : "Anexar currículo (PDF/DOC)"}
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setValue("curriculoFile", f, { shouldValidate: true });
                }}
              />
            </Button>
          </Stack>

          <Box mt={2}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Tempo de experiência (em anos)
            </Typography>

            <Stack spacing={1}>
              {techs.map((tec, idx) => {
                const fieldErr = errors.experiencias?.[idx]?.anos?.message;
                return (
                  <Stack key={tec} direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
                    <Chip label={tec} size="small" color="primary" variant="outlined" sx={{ minWidth: 90 }} />
                    <Controller
                      control={control}
                      name={`experiencias.${idx}.anos`}
                      render={({ field }) => (
                        <TextField
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          sx={{ width: 120 }}
                          value={
                            typeof field.value === "number" && Number.isFinite(field.value)
                              ? String(field.value)
                              : ""
                          }
                          onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D+/g, "");
                            if (onlyDigits === "") {
                              field.onChange(undefined);
                            } else {
                              field.onChange(parseInt(onlyDigits, 10));
                            }
                          }}
                          onBlur={field.onBlur}
                          error={!!fieldErr}
                          helperText={fieldErr}
                        />
                      )}
                    />
                    <input
                      type="hidden"
                      {...register(`experiencias.${idx}.tecnologia` as const)}
                      value={tec}
                    />
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button
          type="submit"
          form="apply-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : undefined}
        >
          {loading ? "Enviando..." : "Enviar candidatura"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
