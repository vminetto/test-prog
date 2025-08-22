import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title?: string;
  message: string;
};

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <Box
      sx={(t) => ({
        maxWidth: 880,
        mx: "auto",
        p: { xs: 4, sm: 5 },
        textAlign: "center",
        borderRadius: 4,
        bgcolor: alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.08 : 0.06),
        border: `1px solid ${alpha(t.palette.primary.main, 0.18)}`,
        boxShadow: `0 12px 48px ${alpha(t.palette.primary.main, 0.18)}`,
      })}
    >
      <Stack spacing={2.5} alignItems="center">
        <Box
          sx={(t) => ({
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(t.palette.primary.main, 0.12),
            color: t.palette.primary.main,
            "& svg": { fontSize: 32 },
          })}
        >
          {icon}
        </Box>

        {title && (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
          {message}
        </Typography>

      </Stack>
    </Box>
  );
}
