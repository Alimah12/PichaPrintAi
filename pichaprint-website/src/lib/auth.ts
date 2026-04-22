const TOKEN_KEY = 'pichaprint_token';

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    console.debug('[auth] setToken, storing token');
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const t = localStorage.getItem(TOKEN_KEY);
  console.debug('[auth] getToken', { present: !!t });
  return t;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    console.debug('[auth] clearToken');
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuthenticated() {
  return !!getToken();
}
