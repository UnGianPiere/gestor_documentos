import { AUTH_COOKIE_NAME } from './constants';

/**
 * Utilidades para manejo de cookies del lado del cliente
 */

export function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const nameEQ = name + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return undefined;
}

export function setCookie(name: string, value: string, days?: number): void {
  if (typeof window === 'undefined') return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + value + expires + "; path=/; SameSite=lax";
}

export function removeCookie(name: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
}

export function getAuthToken(): string | undefined {
  return getCookie(AUTH_COOKIE_NAME);
}

export function setAuthToken(token: string, days: number = 30): void {
  setCookie(AUTH_COOKIE_NAME, token, days);
}

export function removeAuthToken(): void {
  removeCookie(AUTH_COOKIE_NAME);
}

