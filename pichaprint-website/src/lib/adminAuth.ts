import { me, adminAnalytics } from './api';

const ADMIN_TOKEN_KEY = 'pichaprint_admin_token';

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function checkAdminAccess(token: string): Promise<boolean> {
  try {
    const currentUser = await me(token);
    return currentUser?.is_admin || false;
  } catch (error) {
    console.warn('Failed to fetch user info via /me:', error);
    try {
      await adminAnalytics(token);
      return true;
    } catch (fallbackError) {
      console.error('Admin access check failed via /admin/analytics:', fallbackError);
      return false;
    }
  }
}
