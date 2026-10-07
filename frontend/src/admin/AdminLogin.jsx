import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, getToken, TOKEN_KEY } from '../api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (getToken()) return <Navigate to="/admin/orders" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token } = await api('/admin/login', { method: 'POST', body: form });
      localStorage.setItem(TOKEN_KEY, token);
      navigate('/admin/orders', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <form onSubmit={submit} className="card shadow p-4" style={{ width: 360 }}>
        <h4 className="text-center mb-1">🛍️ Shopping Centre</h4>
        <p className="text-center text-muted">Admin Login</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            autoFocus
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-dark w-100" disabled={busy}>
          {busy ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
