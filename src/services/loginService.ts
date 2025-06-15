import api from "@/utils/api";

interface LoginCredentials {
  username: string;
  password: string;
}

export const loginUser = (credentials: LoginCredentials) => 
  api.post('/user/auth/login', credentials);

export const loginTrainer = (credentials: LoginCredentials) => 
  api.post('/trainer/auth/login', credentials);

export const loginStadiumOwner = (credentials: LoginCredentials) => 
  api.post('/stadium_owner/auth/login', credentials);

export const loginAdmin = (credentials: LoginCredentials) => 
  api.post('/admin/auth/login', credentials);