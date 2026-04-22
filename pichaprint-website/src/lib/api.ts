import { HistoryItem, GenerationOutput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pichaprintai-1.onrender.com';
const GENERATOR_URL = process.env.NEXT_PUBLIC_GENERATOR_URL || 'https://goodn6138--ai-hardware-service-fastapi-app.modal.run';

export async function generateHardware(prompt: string): Promise<GenerationOutput> {
  const response = await fetch(`${GENERATOR_URL}/api/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  const baseUrl = GENERATOR_URL;
  const fullUrl = (url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Fetch all files
  const [stlRes, scadRes, circuitRes, firmwareRes, bomRes] = await Promise.all([
    fetch(fullUrl(data.downloads.individual_files.stl.url)),
    fetch(fullUrl(data.downloads.individual_files.scad.url)),
    fetch(fullUrl(data.downloads.individual_files.circuit.url)),
    fetch(fullUrl(data.downloads.individual_files.firmware.url)),
    fetch(fullUrl(data.downloads.individual_files.bom.url))
  ]);
  
  if (!stlRes.ok) throw new Error('STL fetch failed');
  const stlBuffer = await stlRes.arrayBuffer();
  if (!stlBuffer?.byteLength) throw new Error('Empty STL');
  
  const [scadText, circuitJson, firmwareText, bomText] = await Promise.all([
    scadRes.text(),
    circuitRes.json(),
    firmwareRes.text(),
    bomRes.text()
  ]);
  
  return {
    ...data,
    stlData: stlBuffer,
    scadContent: scadText,
    circuitData: circuitJson,
    firmwareContent: firmwareText,
    bomContent: bomText,
    original_prompt: prompt
  };
}

// --- Auth + backend helpers ---
export async function signup(payload: {
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  country?: string | null;
  phone?: string | null;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Signup failed');
  }
  return res.json();
}

export async function login(email: string, password: string) {
  console.debug('[api] login request', { email });
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const json = await res.json();
  console.debug('[api] login response', json);
  return json;
}

export async function me(token: string) {
  console.debug('[api] me request', { token: token ? 'present' : 'missing' });
  const res = await fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const txt = await res.text();
    console.warn('[api] me failed', txt);
    throw new Error('Auth failed');
  }
  const json = await res.json();
  console.debug('[api] me response', json);
  return json;
}

export async function saveDesignToBackend(token: string, input_text: string, output_json: string) {
  const res = await fetch(`${API_URL}/designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ input_text, output_json })
  });
  if (!res.ok) throw new Error('Save design failed');
  return res.json();
}

export async function listDesigns(token?: string, user_id?: number) {
  const url = new URL(`${API_URL}/designs`);
  if (typeof user_id !== 'undefined' && user_id !== null) url.searchParams.set('user_id', String(user_id));
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  console.debug('[api] listDesigns request', { url: url.toString(), hasToken: !!token, user_id });
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const txt = await res.text();
    console.warn('[api] listDesigns failed', txt);
    throw new Error('Failed to list designs');
  }
  const json = await res.json();
  console.debug('[api] listDesigns response length', Array.isArray(json) ? json.length : undefined);
  return json;
}

export async function adminAnalytics(adminToken?: string) {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  console.debug('[api] adminAnalytics request', { hasToken: !!adminToken });
  const res = await fetch(`${API_URL}/admin/analytics`, { headers });
  if (!res.ok) {
    const txt = await res.text();
    console.warn('[api] adminAnalytics failed', txt);
    throw new Error(txt || 'Failed to fetch analytics');
  }
  const json = await res.json();
  console.debug('[api] adminAnalytics response users', Array.isArray(json) ? json.length : undefined);
  return json;
}

export async function adminLogin(username: string, password: string) {
  console.debug('[api] adminLogin request', { username });
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Admin login failed');
  }
  const json = await res.json();
  console.debug('[api] adminLogin response', json);
  return json;
}