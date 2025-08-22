import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Stack } from "@mui/material";
import { useState } from "react";
import type { Job } from "../types/types";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(5, "Descrição deve ter no mínimo 5 caracteres"),
  location: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Pick<Job, "title" | "description" | "location">) => Promise<void>;
};

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e && "response" in e) {
    const err = e as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "Erro ao criar vaga";
  }
  return "Erro ao criar vaga";
}

export default function CreateJobDialog({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormData>({ title: "", description: "", location: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      const msg = result.error.issues.map(i => i.message).join(", ");
      setError(msg || "Dados inválidos");
      return;
    }

    setLoading(true);
    try {
      await onCreate({ ...form, location: form.location ?? "" });
      onClose();
      setForm({ title: "", description: "", location: "" });
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Registrar vaga</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Título"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            autoFocus
            required
          />
          <TextField
            label="Descrição"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            multiline
            minRows={4}
            required
          />
          <TextField
            label="Local"
            value={form.location ?? ""}
            onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
