export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  profile: Profile;
  status?: string;
}
