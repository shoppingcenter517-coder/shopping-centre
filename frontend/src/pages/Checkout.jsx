import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { api, rupee } from '../api.js';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api('/orders', {
        method: 'POST',
        body: {
          customer: form,
          items: items.map((i) => ({ productId: i._id, qty: i.qty })),
        },
      });
      clear();
      navigate(`/order-success/${res.orderNumber}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <h3 className="mb-3">Delivery Details</h3>
        <form onSubmit={submit} className="card shadow-sm p-3">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full name *</label>
              <input className="form-control" name="name" value={form.name} onChange={change} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone (10 digit) *</label>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={change}
                pattern="\d{10}"
                maxLength={10}
                inputMode="numeric"
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Email (optional)</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={change} />
            </div>
            <div className="col-12">
              <label className="form-label">Address *</label>
              <textarea
                className="form-control"
                rows={2}
                name="address"
                value={form.address}
                onChange={change}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">City *</label>
              <input className="form-control" name="city" value={form.city} onChange={change} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Pincode *</label>
              <input
                className="form-control"
                name="pincode"
                value={form.pincode}
                onChange={change}
                pattern="\d{6}"
                maxLength={6}
                inputMode="numeric"
                required
              />
            </div>
          </div>
          <div className="alert alert-secondary mt-3 mb-3 py-2">
            Payment: <strong>Cash on Delivery</strong>
          </div>
          <button className="btn btn-dark btn-lg" disabled={busy}>
            {busy ? 'Placing order...' : `Place Order · ${rupee(total)}`}
          </button>
        </form>
      </div>

      <div className="col-lg-5">
        <h3 className="mb-3">Order Summary</h3>
        <div className="card shadow-sm">
          <ul className="list-group list-group-flush">
            {items.map((i) => (
              <li key={i._id} className="list-group-item d-flex justify-content-between">
                <span>
                  {i.name} <span className="text-muted">× {i.qty}</span>
                </span>
                <span>{rupee(i.price * i.qty)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{rupee(total)}</span>
            </li>
          </ul>
        </div>
        <Link to="/cart" className="btn btn-link mt-2">
          ← Back to cart
        </Link>
      </div>
    </div>
  );
}
