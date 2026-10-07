import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getToken, TOKEN_KEY } from '../api.js';

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!getToken()) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/admin/login', { replace: true });
  };

  const cls = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '');

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand brand">⚙️ Admin Panel</span>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/admin/orders" className={cls}>
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/products" className={cls}>
                Products
              </NavLink>
            </li>
          </ul>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light me-2">
            View Site
          </a>
          <button className="btn btn-sm btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}
