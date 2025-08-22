import { Alert, Box, Card, CardContent, CircularProgress, Snackbar, Typography } from "@mui/material";
import { AvatarUploader, ProfileForm, useProfile } from "@/features/profile";

export default function ProfilePage() {
  const {
    state: { loading, saving, error, ok, profile, avatarPreview, email },
    actions: { setOk, saveProfile, changeAvatar },
  } = useProfile();

  if (loading) {
    return (
      <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Meu Perfil</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <AvatarUploader
            src={avatarPreview}
            emailInitial={email}
            disabled={saving}
            onPick={changeAvatar}
          />

          <ProfileForm
            saving={saving}
            onSubmit={saveProfile}
            initialValues={{
              name: profile?.name || "",
              phone: profile?.phone || "",
              cpf: profile?.cpf || "",
              linkedin: profile?.linkedin || "",
            }}
          />
        </CardContent>
      </Card>

      <Snackbar
        open={!!ok}
        autoHideDuration={2500}
        onClose={() => setOk(null)}
        message={ok || ""}
      />
    </Box>
  );
}
