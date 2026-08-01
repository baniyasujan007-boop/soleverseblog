import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBell, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const dateParts = (value) => {
  if (!value) return ["SOON", ""];
  const date = new Date(value);
  return [date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(), date.getDate()];
};

function Hero({ slides = [], releases = [], settings = {} }) {
  const [current, setCurrent] = useState(0);
  const hero = slides[current];
  useEffect(() => {
    if (slides.length < 2 || settings.autoPlay === false) return undefined;
    const timer = setInterval(() => setCurrent((value) => (value + 1) % slides.length), Math.max(settings.sliderSpeed || 6000, 1000));
    return () => clearInterval(timer);
  }, [settings.autoPlay, settings.sliderSpeed, slides.length]);
  if (!hero) return null;
  const details = hero.metadata || {};
  return (
    <section className="bg-[#050505] text-white">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_370px]">
        <article className="relative min-h-[620px] overflow-hidden border-b border-white/10 px-6 py-14 sm:px-10 lg:min-h-[650px] lg:px-12" style={settings.backgroundImage ? { backgroundImage: `url(${settings.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_42%,#27211f_0%,#0b0a0a_33%,#050505_68%)]" style={{ backgroundColor: settings.overlayColor || undefined, opacity: settings.backgroundImage ? (settings.overlayOpacity ?? 55) / 100 : undefined }} />
          {hero.image && <img src={hero.image} alt={hero.title} fetchPriority="high" className="absolute bottom-[-2%] right-[-9%] z-10 h-[58%] w-[70%] object-contain drop-shadow-[0_35px_28px_rgba(0,0,0,.8)] sm:right-0 sm:h-[75%] lg:w-[62%]" />}
          <div className={`relative z-20 max-w-[560px] pt-5 lg:pt-10 ${settings.textAlign === "center" ? "text-center" : "text-left"}`}>
            <span className="text-[10px] font-bold uppercase tracking-[.5em] text-[#e8d8bd]">{hero.category || "Featured release"}</span>
            <h1 className="mt-4 text-5xl font-black leading-[.92] tracking-[-.065em] sm:text-6xl xl:text-7xl">{hero.title}</h1>
            {(hero.summary || hero.content) && <p className="mt-6 max-w-md text-[15px] leading-6 text-white/72">{hero.summary || hero.content}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={details.primaryCtaLink || `/release/${hero.slug}`} className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white">{details.primaryCtaText || "Explore now"}<FiArrowRight size={17} /></Link>
              <Link to={details.secondaryCtaLink || `/release/${hero.slug}`} className="border border-white/45 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black">{details.secondaryCtaText || "View release info"}</Link>
            </div>
          </div>
          {slides.length > 1 && <><div className="absolute bottom-7 left-6 z-30 flex items-center gap-5 sm:left-10">{slides.map((slide, index) => <button key={slide._id || index} onClick={() => setCurrent(index)} aria-label={`Show slide ${index + 1}`} className={`border-b-2 pb-2 text-xs ${index === current ? "border-[#e8d8bd] text-white" : "border-transparent text-white/50"}`}>0{index + 1}</button>)}</div><div className="absolute right-6 top-6 z-30 flex gap-2"><button onClick={() => setCurrent((current + slides.length - 1) % slides.length)} className="border border-white/20 p-2 hover:bg-white hover:text-black"><FiChevronLeft /></button><button onClick={() => setCurrent((current + 1) % slides.length)} className="border border-white/20 p-2 hover:bg-white hover:text-black"><FiChevronRight /></button></div></>}
        </article>
        <aside className="border-b border-l border-white/10 bg-[#0a0b0b] px-5 py-7 sm:px-7">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-black uppercase">Upcoming releases</h2><Link to="/releases" className="text-[11px] text-white/60 hover:text-white">View Calendar <FiArrowRight className="ml-2 inline" /></Link></div>
          <div>{releases.slice(0, 5).map((release) => { const [month, day] = dateParts(release.metadata?.releaseDate); return <Link key={release._id} to={`/release/${release.slug || release._id}`} className="flex items-center gap-3 border-t border-white/10 py-3 transition hover:bg-white/5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-white/20 text-center leading-none"><b className="text-[9px] font-bold">{month}</b><strong className="text-lg">{day}</strong></span><span className="min-w-0 flex-1"><b className="block line-clamp-2 text-xs leading-5">{release.title}</b><small className="mt-1 block text-[10px] text-white/55">{release.metadata?.brand || release.category || "SoleVerse"}</small></span>{release.image && <img src={release.image} alt="" className="h-10 w-16 object-contain" />}</Link>; })}</div>
          <button className="mt-3 text-white/60 transition hover:text-white" aria-label="Release notifications"><FiBell /></button>
        </aside>
      </div>
    </section>
  );
}
export default Hero;
