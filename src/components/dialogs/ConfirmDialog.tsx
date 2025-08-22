import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDialog({
  open,
  title = "Confirmar ação",
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const [pending, setPending] = useState(false);
  const isLoading = loading || pending;

  const handleConfirm = async () => {
    try {
      setPending(true);
      await onConfirm();
      onClose();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="xs" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && <DialogContent><DialogContentText>{description}</DialogContentText></DialogContent>}

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>{cancelText}</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={variant === "destructive" ? "error" : "primary"}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} /> : undefined}
        >
          {isLoading ? "Aguarde..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
