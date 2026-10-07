import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api(`/products${category !== 'all' ? `?category=${category}` : ''}`)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  const shown = products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));

  const setCat = (c) => setParams(c === 'all' ? {} : { category: c });

  return (
    <>
      <div className="hero p-4 p-md-5 mb-4">
        <h1 className="fw-bold mb-1">Shopping Centre</h1>
        <p className="mb-0 opacity-75">Men &amp; Women fashion — login ki zaroorat nahi, seedha order karo.</p>
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <div className="btn-group">
          {['all', 'men', 'women'].map((c) => (
            <button
              key={c}
              className={'btn ' + (category === c ? 'btn-dark' : 'btn-outline-dark')}
              onClick={() => setCat(c)}
            >
              {c === 'all' ? 'All' : c === 'men' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
        <input
          className="form-control"
          style={{ maxWidth: 260 }}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && shown.length === 0 && (
        <div className="alert alert-light text-center">No products found.</div>
      )}

      <div className="row g-3">
        {shown.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </>
  );
}
