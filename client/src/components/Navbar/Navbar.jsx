import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Navbar() {
  const [items, setItems] = useState([]); const [open, setOpen] = useState(false); const { user } = useAuth();
  useEffect(() => { api.get("/cms/public/homepage").then(({ data }) => setItems((data.data.settings.homepage.navigation?.items || []).filter((item) => item.enabled).sort((a, b) => a.order - b.order))).catch(() => setItems([])); }, []);
  const links = <>{items.map((item) => <NavLink key={`${item.label}-${item.path}`} to={item.path} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm font-bold transition hover:text-red-600 ${isActive ? "text-red-600" : "text-slate-900"}`}>{item.label}</NavLink>)}</>;
  return <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur"><div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6"><Link to="/" className="text-2xl font-black tracking-[-.06em]"><span>Sole</span><span className="text-red-600">Verse</span></Link><div className="hidden items-center gap-7 lg:flex">{links}</div><div className="flex items-center gap-3"><Link to="/search" aria-label="Search" className="rounded-lg p-2 text-xl hover:bg-slate-100"><FiSearch/></Link><Link to={user ? "/profile" : "/login"} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">{user ? "Profile" : "Login"}</Link><button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-xl lg:hidden" aria-label="Toggle menu">{open ? <FiX/> : <FiMenu/>}</button></div></div>{open && <div className="border-t border-slate-100 bg-white px-6 py-5 lg:hidden"><div className="flex flex-col gap-5">{links}</div></div>}</nav>;
}
