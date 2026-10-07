// Dev (npm run dev) me backend localhost:5000 par; build ke baad backend hi site serve karta hai, isliye same address.
const BASE = (
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:5000')
).replace(/\/$/, '');

export const TOKEN_KEY = 'sc_admin_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Server se connect nahi ho paya. Thodi der baad try karo.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    if (auth && res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/admin/login';
    }
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
}

export const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN');
