// types/index.ts
export type User = {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'trainer' | 'stadium_owner' | 'admin';
    // Add any other fields your server returns
  };