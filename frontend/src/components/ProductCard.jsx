import { useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { rupee } from '../api.js';

export default function ProductCard({ product }) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;
  const inCart = items.find((i) => i._id === product._id)?.qty || 0;
  const maxed = inCart >= product.stock;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className={'card product-card h-100 position-relative' + (soldOut ? ' soldout' : '')}>
        {soldOut && <span className="badge bg-danger soldout-badge">Out of Stock</span>}
        {!soldOut && product.stock <= 5 && (
          <span className="badge bg-warning text-dark soldout-badge">Only {product.stock} left</span>
        )}
        <img className="product-img" src={product.image} alt={product.name} loading="lazy" />
        <div className="card-body d-flex flex-column">
          <small className="text-uppercase text-muted">{product.category}</small>
          <h6 className="card-title mb-1">{product.name}</h6>
          <p className="small text-muted flex-grow-1 mb-2">{product.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <strong>{rupee(product.price)}</strong>
            <button
              className={'btn btn-sm ' + (added ? 'btn-success' : 'btn-dark')}
              disabled={soldOut || maxed}
              onClick={handleAdd}
            >
              {soldOut ? 'Sold out' : maxed ? 'Max added' : added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
