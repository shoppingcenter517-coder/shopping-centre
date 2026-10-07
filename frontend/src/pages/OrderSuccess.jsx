import { Link, useParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: 64 }}>✅</div>
      <h2 className="mt-2">Order placed successfully!</h2>
      <p className="text-muted mb-1">Aapka order number:</p>
      <h3 className="fw-bold">{orderNumber}</h3>
      <p className="text-muted">Is number ko save kar lo. Payment delivery par (Cash on Delivery).</p>
      <Link to="/" className="btn btn-dark mt-2">
        Continue shopping
      </Link>
    </div>
  );
}
