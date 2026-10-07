import { useEffect, useState } from 'react';
import { api, rupee } from '../api.js';

const EMPTY = { name: '', category: 'men', price: '', stock: '', image: '', description: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    api('/products')
      .then(setProducts)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(EMPTY);
    setEditId(null);
    setError('');
  };

  const edit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,
      description: p.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api(editId ? `/products/${editId}` : '/products', {
        method: editId ? 'PUT' : 'POST',
        body: form,
        auth: true,
      });
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.name}" delete karna hai?`)) return;
    try {
      await api(`/products/${p._id}`, { method: 'DELETE', auth: true });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <h4 className="mb-3">{editId ? 'Edit Product' : 'Add Product'}</h4>
      <form onSubmit={submit} className="card shadow-sm p-3 mb-4">
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label">Name *</label>
            <input className="form-control" name="name" value={form.name} onChange={change} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Category *</label>
            <select className="form-select" name="category" value={form.category} onChange={change}>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Price (₹) *</label>
            <input
              className="form-control"
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Stock *</label>
            <input
              className="form-control"
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={change}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Image URL</label>
            <input className="form-control" name="image" value={form.image} onChange={change} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <input className="form-control" name="description" value={form.description} onChange={change} />
          </div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-dark" disabled={busy}>
            {busy ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
          </button>
          {editId && (
            <button type="button" className="btn btn-outline-secondary" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 className="mb-3">All Products ({products.length})</h4>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img className="admin-thumb" src={p.image} alt="" />
                      {p.name}
                    </div>
                  </td>
                  <td className="text-capitalize">{p.category}</td>
                  <td>{rupee(p.price)}</td>
                  <td>
                    {p.stock > 0 ? (
                      <span className="badge bg-success">{p.stock} in stock</span>
                    ) : (
                      <span className="badge bg-danger">Out of stock</span>
                    )}
                  </td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-dark me-1" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
