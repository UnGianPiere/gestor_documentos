'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/services/auth-service';
import { USER_KEY, AUTH_COOKIE_NAME } from '@/lib/constants';

interface User {
  id: string;
  nombres: string;
  usuario: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usuario: string, contrasenna: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const checkAuth = useCallback(async () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      // Limpiar cookies y localStorage antiguos que puedan estar interfiriendo
      const { getCookie } = await import('@/lib/cookies');
      const oldGestorToken = getCookie('gestor_documentos_auth_token');
      if (oldGestorToken) {
        document.cookie = 'gestor_documentos_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }

      // Limpiar localStorage de otras aplicaciones
      const keysToRemove = ['token', 'refresh_token'];
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });

      // Verificar si hay token en cookies y datos de usuario en localStorage
      const { getAuthToken } = await import('@/lib/cookies');
      const token = getAuthToken();
      const userData = localStorage.getItem(USER_KEY);


      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('CheckAuth - Usuario parseado:', parsedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      } else {
        // Si no hay token o usuario, limpiar todo
        console.log('CheckAuth - No hay token o userData, haciendo logout');
        authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (usuario: string, contrasenna: string) => {
      try {
        const loginData = await authService.login(usuario, contrasenna);
        setUser(loginData.usuario);
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Solo ejecutar checkAuth después de que el componente esté montado
  useEffect(() => {
    setMounted(true);

    // Pequeño delay para asegurar que las cookies estén disponibles
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: !mounted || isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
