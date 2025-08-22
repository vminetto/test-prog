export type User = {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  cpf?: string;
  linkedin?: string;
  avatarUrl?: string;
};


export type AuthResponse = {
token: string;
user: User;
};