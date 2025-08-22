import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack, TextField } from "@mui/material";

const schema = z.object({
  name: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  cpf: z.string().max(20).optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
});
export type ProfileFormSchema = z.infer<typeof schema>;

type Props = {
  initialValues: ProfileFormSchema;
  saving?: boolean;
  onSubmit: (values: ProfileFormSchema) => Promise<void> | void;
};

export default function ProfileForm({ initialValues, saving, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Nome"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Telefone"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      <TextField
        label="CPF"
        {...register("cpf")}
        error={!!errors.cpf}
        helperText={errors.cpf?.message}
      />
      <TextField
        label="LinkedIn (URL)"
        {...register("linkedin")}
        error={!!errors.linkedin}
        helperText={errors.linkedin?.message}
      />

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" disabled={!!saving || !isDirty}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </Box>
    </Stack>
  );
}
