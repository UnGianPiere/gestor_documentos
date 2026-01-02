import { removeAuthToken, getAuthToken, setAuthToken } from '@/lib/cookies';
import { TOKEN_EXPIRY_DAYS, REFRESH_TOKEN_KEY, USER_KEY } from '@/lib/constants';

export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: {
    id: string;
    nombres: string;
    usuario: string;
    email: string;
    role: string;
  };
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  usuario: {
    id: string;
    nombres: string;
    usuario: string;
    email: string;
    role: string;
  };
}

class AuthService {
  private refreshPromise: Promise<string | null> | null = null;

  /**
   * Registra un nuevo usuario
   */
  async register(nombres: string, usuario: string, email: string, contrasenna: string): Promise<RegisterResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombres, usuario, email, contrasenna }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el registro');
      }

      const registerData: RegisterResponse = await response.json();
      return registerData;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error en el registro');
    }
  }

  /**
   * Inicia sesión con usuario y contraseña
   */
  async login(usuario: string, contrasenna: string): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasenna }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el inicio de sesión');
      }

      const loginData: LoginResponse = await response.json();

      // Guardar token en cookie
      if (typeof window !== 'undefined') {
        setAuthToken(loginData.token, TOKEN_EXPIRY_DAYS);

        // Guardar refresh token en localStorage
        const refreshTokenData = {
          token: loginData.refreshToken,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        };
        localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshTokenData));

        // Guardar usuario en localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(loginData.usuario));
      }

      return loginData;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error en el inicio de sesión');
    }
  }

  /**
   * Refresca el token de autenticación
   */
  async refreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    // Verificar si hay un token guardado
    const token = getAuthToken();
    if (!token) return null;

    // Verificar si el refresh token ha expirado (si existe)
    const refreshTokenData = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshTokenData) {
      try {
        const parsedData = JSON.parse(refreshTokenData);
        const { expiresAt } = parsedData;

        if (expiresAt && new Date(expiresAt) < new Date()) {
          this.logout();
          return null;
        }
      } catch (parseError) {
        // Si hay error al parsear, continuar con el token actual
        console.warn('Error parsing refresh token data:', parseError);
      }
    }

    // Retornar el token actual si existe y no ha expirado
    return token;
  }

  /**
   * Cierra sesión y limpia todos los datos de autenticación
   */
  logout(): void {
    if (typeof window === 'undefined') return;

    removeAuthToken();
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('selectedRole');
  }

  /**
   * Obtiene los headers de autenticación
   */
  getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? getAuthToken() : undefined;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Valida si el token actual es válido
   */
  async validateToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const token = getAuthToken();
    if (!token) return false;

    // Verificar si hay datos de usuario guardados
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return false;

    // Verificar si el refresh token ha expirado (si existe)
    const refreshTokenData = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshTokenData) {
      try {
        const parsedData = JSON.parse(refreshTokenData);
        const { expiresAt } = parsedData;

        if (expiresAt && new Date(expiresAt) < new Date()) {
          return false;
        }
      } catch (parseError) {
        // Si hay error al parsear, asumir que es válido si hay token
        console.warn('Error parsing refresh token data:', parseError);
      }
    }

    // Si hay token y datos de usuario, considerar válido
    return true;
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
