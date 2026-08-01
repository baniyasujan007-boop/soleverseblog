import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiChevronDown,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

const links = [
  ["/admin", "Dashboard", FiGrid, true],
  ["/admin/articles", "Articles", FiBookOpen],
  ["/admin/releases", "Releases", FiTruck],
  ["/admin/reviews", "Reviews", FiStar],
  ["/admin/guides", "Buying Guides", FiBookOpen],
  ["/admin/media", "Media Library", FiImage],
  ["/admin/brands", "Brands", FiShoppingBag],
  ["/admin/users", "Users", FiUsers],
  ["/admin/newsletter", "Newsletter", FiBell],
  ["/admin/calendar", "Analytics", FiCalendar],
  ["/admin/categories", "SEO", FiTag],
  ["/admin/settings", "Settings", FiSettings],
];
const homepageLinks = [
  ["/admin/home/hero", "Hero Section", FiImage],
  ["/admin/home/hero-slides", "Hero Slides", FiImage],
  ["/admin/home/featured-news", "Featured News", FiBookOpen],
  ["/admin/home/featured-releases", "Featured Releases", FiTruck],
  ["/admin/home/trending", "Trending Section", FiStar],
  ["/admin/home/brands", "Brands Section", FiShoppingBag],
  ["/admin/home/newsletter", "Newsletter Section", FiBell],
  ["/admin/home/seo", "Homepage SEO", FiTag],
];

export function RequireAdmin() {
  const { user, ready } = useAdmin();
  if (!ready)
    return (
      <div className="admin-app grid min-h-screen place-items-center">
        Loading admin panel…
      </div>
    );
  return user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [homepageOpen, setHomepageOpen] = useState(true);
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const leave = () => {
    logout();
    navigate("/admin/login");
  };
  const avatar = user?.name?.[0]?.toUpperCase() || "A";
  const homepageActive = location.pathname.startsWith("/admin/home");
  const navigation = (
    <nav className="admin-nav">
      <div className="admin-nav-group">
        <button
          type="button"
          className={`admin-nav-link admin-nav-group-trigger ${homepageActive ? "active" : ""}`}
          onClick={() => setHomepageOpen((isOpen) => !isOpen)}
          aria-expanded={homepageOpen}
          aria-controls="homepage-navigation"
        >
          <FiGrid size={18} />
          <span>Homepage</span>
          <FiChevronDown
            className={`admin-nav-chevron transition-transform ${homepageOpen ? "rotate-180" : ""}`}
            size={15}
          />
        </button>
        {homepageOpen && (
          <div id="homepage-navigation" className="admin-nav-submenu">
            {homepageLinks.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `admin-nav-sublink ${isActive ? "active" : ""}`
                }
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
      {links.map(([to, label, Icon, end]) => (
        <NavLink
          end={end}
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
  const side = (
    <>
      <div className="admin-logo">
        <span className="admin-logo-mark">◒</span>
        <span>
          SoleVerse<small>ADMIN PANEL</small>
        </span>
      </div>
      {navigation}
      <div
        className="admin-profile"
        onClick={() => navigate("/admin/profile")}
        role="button"
        tabIndex={0}
      >
        <span className="admin-avatar">{avatar}</span>
        <span>
          <b>{user?.name || "Super Admin"}</b>
          <small>Administrator</small>
        </span>
        <i />
      </div>
      <button className="admin-logout" onClick={leave}>
        <FiLogOut /> Sign out
      </button>
      <small className="admin-version">
        © 2024 SoleVerse <span>v1.0.0</span>
      </small>
    </>
  );
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">{side}</aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="admin-menu"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          <label className="admin-search">
            <FiSearch />
            <input placeholder="Search articles, releases, users..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="admin-top-actions">
            <button aria-label="Dark theme">
              <FiMoon />
            </button>
            <button className="admin-notification" aria-label="Notifications">
              <FiBell />
              <em>8</em>
            </button>
            <div className="admin-user">
              <span className="admin-avatar">{avatar}</span>
              <span>
                <b>{user?.name || "Super Admin"}</b>
                <small>Administrator</small>
              </span>
              <FiChevronDown />
            </div>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
      {open && (
        <div className="admin-overlay" onClick={() => setOpen(false)}>
          <aside
            className="admin-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="admin-close" onClick={() => setOpen(false)}>
              <FiX />
            </button>
            {side}
          </aside>
        </div>
      )}
    </div>
  );
}
