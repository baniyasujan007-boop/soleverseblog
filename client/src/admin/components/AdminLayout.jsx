import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiBell, FiBookOpen, FiCalendar, FiChevronDown, FiGrid, FiImage, FiLogOut, FiMenu, FiMoon, FiSearch, FiSettings, FiShoppingBag, FiStar, FiTag, FiTruck, FiUsers, FiX } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

const links = [
  ["/admin", "Dashboard", FiGrid, true], ["/admin/home", "Homepage", FiGrid], ["/admin/hero-slides", "Hero Slides", FiImage], ["/admin/articles", "Articles", FiBookOpen],
  ["/admin/releases", "Releases", FiTruck], ["/admin/reviews", "Reviews", FiStar],
  ["/admin/guides", "Buying Guides", FiBookOpen], ["/admin/media", "Media Library", FiImage],
  ["/admin/brands", "Brands", FiShoppingBag], ["/admin/users", "Users", FiUsers],
  ["/admin/newsletter", "Newsletter", FiBell], ["/admin/calendar", "Analytics", FiCalendar],
  ["/admin/categories", "SEO", FiTag], ["/admin/settings", "Settings", FiSettings],
];

export function RequireAdmin() {
  const { user, ready } = useAdmin();
  if (!ready) return <div className="admin-app grid min-h-screen place-items-center">Loading admin panel…</div>;
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAdmin();
  const navigate = useNavigate();
  const leave = () => { logout(); navigate("/admin/login"); };
  const avatar = user?.name?.[0]?.toUpperCase() || "A";
  const navigation = <nav className="admin-nav">
    {links.map(([to, label, Icon, end], index) => <NavLink end={end} key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
      <Icon size={18} /><span>{label}</span>{[1, 2, 3, 4, 5, 11].includes(index) && <FiChevronDown className="admin-nav-chevron" size={15} />}
    </NavLink>)}
  </nav>;
  const side = <>
    <div className="admin-logo"><span className="admin-logo-mark">◒</span><span>SoleVerse<small>ADMIN PANEL</small></span></div>
    {navigation}
    <div className="admin-profile" onClick={() => navigate("/admin/profile")} role="button" tabIndex={0}>
      <span className="admin-avatar">{avatar}</span><span><b>{user?.name || "Super Admin"}</b><small>Administrator</small></span><i />
    </div>
    <button className="admin-logout" onClick={leave}><FiLogOut /> Sign out</button>
    <small className="admin-version">© 2024 SoleVerse <span>v1.0.0</span></small>
  </>;
  return <div className="admin-app">
    <aside className="admin-sidebar">{side}</aside>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-menu" onClick={() => setOpen(true)} aria-label="Open menu"><FiMenu /></button>
        <label className="admin-search"><FiSearch /><input placeholder="Search articles, releases, users..." /><kbd>⌘ K</kbd></label>
        <div className="admin-top-actions"><button aria-label="Dark theme"><FiMoon /></button><button className="admin-notification" aria-label="Notifications"><FiBell /><em>8</em></button><div className="admin-user"><span className="admin-avatar">{avatar}</span><span><b>{user?.name || "Super Admin"}</b><small>Administrator</small></span><FiChevronDown /></div></div>
      </header>
      <main className="admin-main"><Outlet /></main>
    </div>
    {open && <div className="admin-overlay" onClick={() => setOpen(false)}><aside className="admin-drawer" onClick={(event) => event.stopPropagation()}><button className="admin-close" onClick={() => setOpen(false)}><FiX /></button>{side}</aside></div>}
  </div>;
}
