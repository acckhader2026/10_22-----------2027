import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlatformRole } from '../types';
import { UserProfile, loginUser, fetchCurrentUser, logoutUser, registerUser } from '../api/authApi';
import { apiClient } from '../api/apiClient';

export interface AuthContextType {
  user: UserProfile | null;
  role: PlatformRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<UserProfile>;
  quickSwitchRole?: (role: PlatformRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const initAuth = async () => {
    setIsLoading(true);
    try {
      const token = apiClient.getAccessToken();
      if (token) {
        const profile = await fetchCurrentUser();
        setUser(profile);
      } else {
        // Auto-authenticate with default student account for instant smooth experience
        try {
          const res = await loginUser('student@eb.edu.eg', 'Password123!');
          setUser(res.user);
        } catch {
          setUser(null);
        }
      }
    } catch {
      apiClient.clearTokens();
      try {
        const res = await loginUser('student@eb.edu.eg', 'Password123!');
        setUser(res.user);
      } catch {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const quickSwitchRole = async (targetRole: PlatformRole) => {
    const roleCredentials: Record<PlatformRole, { email: string; pass: string }> = {
      STUDENT: { email: 'student@eb.edu.eg', pass: 'Password123!' },
      TEACHER: { email: 'teacher@eb.edu.eg', pass: 'Password123!' },
      CONTENT_MANAGER: { email: 'content@eb.edu.eg', pass: 'Password123!' },
      ADMIN: { email: 'admin@eb.edu.eg', pass: 'Password123!' }
    };
    const cred = roleCredentials[targetRole];
    if (cred) {
      try {
        await login(cred.email, cred.pass);
        return;
      } catch {
        setIsAuthModalOpen(true);
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  const role: PlatformRole = user?.role || 'STUDENT';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        quickSwitchRole,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
