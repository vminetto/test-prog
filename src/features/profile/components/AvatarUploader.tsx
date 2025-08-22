import { Avatar, Button, Typography, Stack } from "@mui/material";

type Props = {
  src?: string;
  emailInitial?: string;
  disabled?: boolean;
  onPick: (file: File) => void;
};

export default function AvatarUploader({ src, emailInitial, disabled, onPick }: Props) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" sx={{ mb: 3 }}>
      <Avatar src={src || undefined} sx={{ width: 96, height: 96 }}>
        {!src && (emailInitial?.[0]?.toUpperCase() || "U")}
      </Avatar>
      <div>
        <Button component="label" variant="outlined" size="small" disabled={disabled}>
          Trocar foto
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
            }}
          />
        </Button>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
          PNG/JPG. Tamanho recomendado 256x256.
        </Typography>
      </div>
    </Stack>
  );
}
