import { Fragment, useCallback, useEffect, useState } from 'react';
import { api, rupee } from '../api.js';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const BADGE = {
  Pending: 'warning text-dark',
  Confirmed: 'info text-dark',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [o, s] = await Promise.all([
        api(`/orders${filter !== 'All' ? `?status=${filter}` : ''}`, { auth: true }),
        api('/admin/stats', { auth: true }),
      ]);
      setOrders(o);
      setStats(s);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api(`/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (o) => {
    if (!window.confirm(`Order ${o.orderNumber} delete karna hai?`)) return;
    try {
      await api(`/orders/${o._id}`, { method: 'DELETE', auth: true });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      {stats && (
        <div className="row g-3 mb-4">
          {[
            ['Total Orders', stats.totalOrders],
            ['Pending', stats.pending],
            ['Revenue', rupee(stats.revenue)],
            ['Products', `${stats.products} (${stats.outOfStock} out)`],
          ].map(([label, value]) => (
            <div className="col-6 col-md-3" key={label}>
              <div className="card shadow-sm text-center p-3">
                <div className="text-muted small">{label}</div>
                <div className="fs-4 fw-bold">{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h4 className="mb-0">Orders</h4>
        <div className="btn-group btn-group-sm flex-wrap">
          {['All', ...STATUSES].map((s) => (
            <button
              key={s}
              className={'btn ' + (filter === s ? 'btn-dark' : 'btn-outline-dark')}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="spinner-border" />}
      {!loading && orders.length === 0 && <div className="alert alert-light">No orders yet.</div>}

      {orders.length > 0 && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <Fragment key={o._id}>
                    <tr>
                      <td className="fw-semibold">{o.orderNumber}</td>
                      <td className="small">{new Date(o.createdAt).toLocaleString('en-IN')}</td>
                      <td>
                        {o.customer.name}
                        <div className="small text-muted">{o.customer.phone}</div>
                      </td>
                      <td>{rupee(o.total)}</td>
                      <td>
                        {o.status === 'Cancelled' ? (
                          <span className={`badge bg-${BADGE[o.status]}`}>{o.status}</span>
                        ) : (
                          <select
                            className="form-select form-select-sm"
                            style={{ minWidth: 120 }}
                            value={o.status}
                            onChange={(e) => changeStatus(o._id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="text-nowrap">
                        <button
                          className="btn btn-sm btn-outline-dark me-1"
                          onClick={() => setOpen(open === o._id ? null : o._id)}
                        >
                          {open === o._id ? 'Hide' : 'View'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(o)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                    {open === o._id && (
                      <tr className="table-light">
                        <td colSpan={6}>
                          <div className="row">
                            <div className="col-md-6">
                              <strong>Delivery address</strong>
                              <div>{o.customer.name}</div>
                              <div>{o.customer.address}</div>
                              <div>
                                {o.customer.city} - {o.customer.pincode}
                              </div>
                              <div>📞 {o.customer.phone}</div>
                              {o.customer.email && <div>✉️ {o.customer.email}</div>}
                              <div className="mt-1 text-muted small">{o.paymentMethod}</div>
                            </div>
                            <div className="col-md-6">
                              <strong>Items</strong>
                              <ul className="mb-0 ps-3">
                                {o.items.map((i, idx) => (
                                  <li key={idx}>
                                    {i.name} × {i.qty} — {rupee(i.price * i.qty)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
