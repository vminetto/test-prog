import { Paper } from "@mui/material";

type Props = { children: React.ReactNode };

export default function AuthCard({ children }: Props) {
  return (
    <Paper
      elevation={8}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        bgcolor: "common.white",
        color: "text.primary",
        width: "100%",
        maxWidth: 420,
        minHeight: { xs: "auto", sm: 420 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </Paper>
  );
}
