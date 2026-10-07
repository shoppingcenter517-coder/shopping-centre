import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { rupee } from '../api.js';

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>Your cart is empty</h4>
        <Link to="/" className="btn btn-dark mt-3">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <h3 className="mb-3">Your Cart</h3>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{ width: 150 }}>Qty</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img className="cart-thumb" src={i.image} alt="" />
                      <span>{i.name}</span>
                    </div>
                  </td>
                  <td>{rupee(i.price)}</td>
                  <td>
                    <div className="input-group input-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setQty(i._id, i.qty - 1)}
                      >
                        −
                      </button>
                      <span className="form-control text-center">{i.qty}</span>
                      <button
                        className="btn btn-outline-secondary"
                        disabled={i.qty >= i.stock}
                        onClick={() => setQty(i._id, i.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{rupee(i.price * i.qty)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(i._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex flex-wrap justify-content-between align-items-center gap-2">
          <Link to="/" className="btn btn-outline-dark">
            ← Continue shopping
          </Link>
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0">Total: {rupee(total)}</h5>
            <button className="btn btn-dark" onClick={() => navigate('/checkout')}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
