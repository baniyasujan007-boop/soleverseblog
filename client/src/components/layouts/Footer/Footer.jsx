import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const socials = [["instagram", FaInstagram], ["twitter", FaXTwitter], ["facebook", FaFacebookF], ["youtube", FaYoutube]];
export default function Footer() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get("/cms/public/homepage").then(({ data }) => setSettings(data.data.settings)).catch(() => setSettings({})); }, []);
  const homepage = settings?.homepage?.footer || {}; const links = homepage.quickLinks?.length ? homepage.quickLinks : [];
  return <footer className="mt-10 bg-[#07090d] text-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><Link to="/" className="text-3xl font-black tracking-[-.06em]"><span>Sole</span><span className="text-red-600">Verse</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{homepage.description || settings?.footerText}</p><div className="mt-6 flex gap-4">{socials.map(([key, Icon]) => settings?.social?.[key] && <a key={key} href={settings.social[key]} target="_blank" rel="noreferrer" aria-label={key} className="text-lg text-white transition hover:text-red-500"><Icon/></a>)}</div></div><div><h3 className="font-bold">Explore</h3><div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">{links.map((link) => <Link key={`${link.label}-${link.path}`} to={link.path}>{link.label}</Link>)}</div></div><div><h3 className="font-bold">Categories</h3><div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">{(homepage.categories || []).map((category) => <Link key={category} to={`/news?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div></div><div><h3 className="font-bold">Contact</h3><p className="mt-4 text-sm leading-6 text-slate-400">{homepage.contact}</p></div></div><div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">{homepage.copyright || `© ${new Date().getFullYear()} ${settings?.siteName || "SoleVerse"}. All rights reserved.`}</div></div></footer>;
}
