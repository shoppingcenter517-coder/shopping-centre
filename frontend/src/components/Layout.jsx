import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';

export default function Layout() {
  const { count } = useCart();
  const { pathname, search } = useLocation();
  const cat = new URLSearchParams(search).get('category');

  const linkClass = (active) => 'nav-link' + (active ? ' active fw-semibold' : '');

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand brand" to="/">
            🛍️ Shopping Centre
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={linkClass(pathname === '/' && !cat)} to="/">
                  All
                </Link>
              </li>
              <li className="nav-item">
                <Link className={linkClass(pathname === '/' && cat === 'men')} to="/?category=men">
                  Men
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={linkClass(pathname === '/' && cat === 'women')}
                  to="/?category=women"
                >
                  Women
                </Link>
              </li>
            </ul>
            <NavLink to="/cart" className="btn btn-outline-light position-relative">
              🛒 Cart
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4" style={{ minHeight: '70vh' }}>
        <Outlet />
      </main>

      <footer className="text-center py-4 small">
        © {new Date().getFullYear()} Shopping Centre · College Project
      </footer>
    </>
  );
}
