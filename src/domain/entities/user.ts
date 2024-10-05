export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;  // Allow null for name
  role?: string | null;  // Optional and allow null
  avatar?: string | null;
  profession?: string;
  country?: string;
}