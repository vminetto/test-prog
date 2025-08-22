import { useEffect, useMemo, useState } from "react";
import { getMyProfile, updateMyProfile, uploadMyAvatar } from "@/features/profile/api/api";
import type { Profile } from "@/features/profile/types/types";

export type ProfileFormValues = {
  name?: string;
  phone?: string;
  cpf?: string;
  linkedin?: string;
};

export function useProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await getMyProfile();
        setProfile(me);
        setAvatarPreview(me.avatarUrl || "");
      } catch {
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const email = useMemo(() => profile?.email || "", [profile]);

  const saveProfile = async (data: ProfileFormValues) => {
    try {
      setSaving(true);
      setError(null);
      const next = await updateMyProfile(data);
      setProfile(next);
      setOk("Dados salvos com sucesso!");
    } catch {
      setError("Falha ao salvar seu perfil.");
      throw new Error("save-failed");
    } finally {
      setSaving(false);
    }
  };

  const changeAvatar = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    setAvatarPreview(dataUrl);
    try {
      setSaving(true);
      const next = await uploadMyAvatar(dataUrl);
      setProfile(next);
      setOk("Foto atualizada!");
    } catch {
      setError("Falha ao atualizar o avatar.");
    } finally {
      setSaving(false);
    }
  };

  return {
    state: { loading, saving, error, ok, profile, avatarPreview, email },
    actions: { setOk, setError, saveProfile, changeAvatar },
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
