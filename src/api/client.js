const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('campus_os_user') || 'null');
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const user = getStoredUser();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const token = localStorage.getItem('campus_os_access_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (user?.id) headers.set('X-User-Id', user.id);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
  return payload.data ?? payload;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiRequest(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, body) => apiRequest(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};
