import { Link, NavLink } from "react-router-dom";
import { FiBookmark, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHomepage } from "../../context/HomepageContext";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d8bd]";

const linkClass = ({ isActive }) =>
  `border-b-2 py-[25px] text-xs font-bold uppercase transition ${focusRing} ${
    isActive
      ? "border-[#e8d8bd] text-white"
      : "border-transparent text-white/75 hover:text-white"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data } = useHomepage();
  const items = (data?.settings?.homepage?.navigation?.items || [])
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order);
  const links = items.map((item) => (
    <NavLink
      key={`${item.label}-${item.path}`}
      to={item.path}
      onClick={() => setOpen(false)}
      className={linkClass}
    >
      {item.label}
    </NavLink>
  ));
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/95 text-white backdrop-blur" aria-label="Main navigation">
      <div className="mx-auto flex h-[70px] max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <Link to="/" className="leading-none">
          <span className="block text-[29px] font-black tracking-[-.09em]">SoleVerse</span>
          <span className="block pt-1 text-[9px] font-bold tracking-[.15em]">EVERYTHING SNEAKERS.</span>
        </Link>
        <div className="hidden h-full items-center gap-8 lg:flex">{links}</div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/search" aria-label="Search" className={`p-2 text-lg ${focusRing}`}>
            <FiSearch />
          </Link>
          <Link to={user ? "/profile" : "/login"} aria-label={user ? "Profile" : "Login"} className={`hidden p-2 text-lg ${focusRing} sm:block`}>
            <FiBookmark />
          </Link>
          <Link to={user ? "/profile" : "/login"} className={`hidden border border-white/30 px-5 py-2.5 text-[11px] font-bold uppercase transition hover:border-white ${focusRing} sm:block`}>
            {user ? "Profile" : "Login"}
          </Link>
          {!user && (
            <Link to="/signup" className={`hidden bg-[#eee0c9] px-5 py-2.5 text-[11px] font-black uppercase text-black transition hover:bg-white ${focusRing} sm:block`}>
              Sign up
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`p-2 text-xl lg:hidden ${focusRing}`}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-[#080808] px-6 pb-5 lg:hidden">
          <div className="flex flex-col">{links}</div>
        </div>
      )}
    </nav>
  );
}
