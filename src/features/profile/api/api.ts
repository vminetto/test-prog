import { api } from "@/lib/axios";
import type { Profile } from "../types/types";

export const getMyProfile = () =>
  api.get<Profile>("/profile/me").then(r => r.data);

export const updateMyProfile = (payload: Partial<Profile>) =>
  api.put<Profile>("/profile/me", payload).then(r => r.data);

export const uploadMyAvatar = (dataUrl: string) =>
  api.put<Profile>("/profile/me/avatar", { avatarUrl: dataUrl }).then(r => r.data);
