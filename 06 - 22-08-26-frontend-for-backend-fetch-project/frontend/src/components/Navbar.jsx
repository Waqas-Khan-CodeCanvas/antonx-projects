import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Badge from "./Badge";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            F
          </div>
          <span className="text-sm font-semibold text-slate-900">Fetch Lab</span>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          {isAuthenticated && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
          {isAuthenticated && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          <NavLink to="/playground" className={linkClass}>Playground</NavLink>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm text-slate-700">{user?.username}</span>
                <Badge tone={isAdmin ? "amber" : "indigo"}>{user?.role}</Badge>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Log in
            </NavLink>
          )}
        </div>
      </nav>

      <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:hidden">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        {isAuthenticated && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
        {isAuthenticated && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
        {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        <NavLink to="/playground" className={linkClass}>Playground</NavLink>
      </div>
    </header>
  );
}