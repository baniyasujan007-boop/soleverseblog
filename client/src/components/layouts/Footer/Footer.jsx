import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useHomepage } from "../../../context/HomepageContext";

const socials = [["instagram", FaInstagram], ["twitter", FaXTwitter], ["facebook", FaFacebookF], ["youtube", FaYoutube]];
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9]";

export default function Footer() {
  const { data } = useHomepage();
  const settings = data?.settings || {};
  const homepage = settings?.homepage?.footer || {};
  const links = homepage.quickLinks?.length ? homepage.quickLinks : [];
  return (
    <footer className="mt-10 border-t border-white/10 bg-[#050505] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-block leading-none">
              <span className="text-[29px] font-black tracking-[-.09em]">Sole<span className="text-[#eee0c9]">Verse</span></span>
              <span className="block pt-1 text-[9px] font-bold tracking-[.15em] text-white/60">EVERYTHING SNEAKERS.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">{homepage.description || settings?.footerText}</p>
            <div className="mt-6 flex gap-4">
              {socials.map(([key, Icon]) => settings?.social?.[key] && (
                <a key={key} href={settings.social[key]} target="_blank" rel="noreferrer" aria-label={key} className={`text-lg text-white/70 transition hover:text-[#eee0c9] ${focusRing}`}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Explore">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Explore</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
              {links.map((link) => (
                <Link key={`${link.label}-${link.path}`} to={link.path} className={`transition hover:text-white ${focusRing}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          <nav aria-label="Categories">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Categories</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
              {(homepage.categories || []).map((category) => (
                <Link key={category} to={`/news?category=${encodeURIComponent(category)}`} className={`transition hover:text-white ${focusRing}`}>
                  {category}
                </Link>
              ))}
            </div>
          </nav>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Contact</h3>
            <p className="mt-4 text-sm leading-6 text-white/60">{homepage.contact}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/45">
          {homepage.copyright || `© ${new Date().getFullYear()} ${settings?.siteName || "SoleVerse"}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
