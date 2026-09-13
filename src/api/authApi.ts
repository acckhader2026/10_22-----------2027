import { apiClient } from './apiClient';
import { PlatformRole } from '../types';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: PlatformRole;
  status: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const data = await apiClient.request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.accessToken) {
    apiClient.setTokens(data.accessToken, data.refreshToken);
  }
  return data;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResponse> {
  const data = await apiClient.request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (data.accessToken) {
    apiClient.setTokens(data.accessToken, data.refreshToken);
  }
  return data;
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const data = await apiClient.request<{ success: boolean; user: UserProfile }>('/api/auth/me');
  return data.user;
}

export async function logoutUser(refreshToken?: string) {
  try {
    await apiClient.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  } catch {}
  apiClient.clearTokens();
}
