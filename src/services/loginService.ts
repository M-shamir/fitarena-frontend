import api from "@/utils/api";

export const loginUser = (formData: any) => api.post('/user/auth/login', formData);
export const loginTrainer = (formData: any) => api.post('/trainer/auth/login', formData);
export const loginStadiumOwner = (formData: any) => api.post('/stadium_owner/auth/login', formData);