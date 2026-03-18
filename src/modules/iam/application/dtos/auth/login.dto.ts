export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string | null;
  user: { id: string; email: string; name: string };
}

