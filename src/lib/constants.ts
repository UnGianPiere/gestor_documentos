/**
 * Constantes de la aplicación
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql';

export const AUTH_COOKIE_NAME = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';
export const SELECTED_ROLE_KEY = 'selectedRole';

export const TOKEN_EXPIRY_DAYS = 30;
export const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

