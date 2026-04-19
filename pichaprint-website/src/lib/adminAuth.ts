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
    console.log('Checking admin access via /me endpoint...');
    const currentUser = await me(token);
    console.log('User info from /me:', currentUser);
    return currentUser?.is_admin || false;
  } catch (error) {
    console.warn('Failed to fetch user info via /me:', error);
    try {
      console.log('Falling back to /admin/analytics endpoint...');
      await adminAnalytics(token);
      console.log('Admin access confirmed via /admin/analytics');
      return true;
    } catch (fallbackError) {
      console.error('Admin access check failed via /admin/analytics:', fallbackError);
      return false;
    }
  }
}
