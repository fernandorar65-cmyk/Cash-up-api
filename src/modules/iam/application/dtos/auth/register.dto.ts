export interface RegisterCommand {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

