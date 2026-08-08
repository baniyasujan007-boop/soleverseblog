import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";
import { optimizeImage } from "../../utils/image";

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-white/40">{label}</dt>
      <dd className="mt-1 font-black text-white">{value}</dd>
    </div>
  );
}

function BrandHero({ brand, stats = {}, loading = false, backLink = null }) {
  if (loading) {
    return (
      <section className="bg-[#050505]" aria-label="Loading featured brand">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <div className="h-3 w-40 animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-14 w-2/3 max-w-xl animate-pulse rounded bg-white/15" />
          <div className="mt-8 h-3 w-1/2 max-w-sm animate-pulse rounded bg-white/15" />
          <div className="mt-10 flex flex-wrap gap-3">
            <div className="h-12 w-44 animate-pulse bg-[#eee0c9]/30" />
          </div>
        </div>
      </section>
    );
  }

  if (!brand) {
    return (
      <section className="bg-[#050505] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#e8d8bd]">
            SoleVerse editorial
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
            Sneaker Brands
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
            Explore the labels shaping sneaker culture — from heritage giants to the
            houses defining the next decade.
          </p>
        </div>
      </section>
    );
  }

  const accent = brand.primaryColor || "#eee0c9";
  const accentSecondary = brand.secondaryColor || "#ffffff";

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
        aria-hidden="true"
      />
      <div
        className={`relative mx-auto grid max-w-[1600px] items-center ${
          brand.image ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""
        }`}
      >
        <div className="px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
          {backLink && (
            <Link
              to={backLink.to}
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> {backLink.label}
            </Link>
          )}
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.5em] ${
              backLink ? "mt-8" : ""
            }`}
            style={{ color: accent }}
          >
            {backLink ? "Brand hub" : "Featured brand"}
          </p>
          {brand.country && (
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/60">
              {brand.country}
              {brand.founded ? ` · Est. ${brand.founded}` : ""}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
            {brand.name}
          </h1>
          {brand.shortDescription && (
            <p className="mt-6 max-w-xl text-[15px] leading-6 text-white/70">
              {brand.shortDescription}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
              >
                Visit Official Website <FiExternalLink size={16} />
              </a>
            )}
            {!backLink && (
              <Link
                to={`/brand/${brand.id}`}
                className="inline-flex items-center gap-3 border border-white/45 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                Brand hub <FiArrowRight size={17} />
              </Link>
            )}
          </div>
          {(stats.releases || stats.reviews || stats.guides || stats.articles) && (
            <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-5 text-[11px] uppercase tracking-wide text-white/50 sm:grid-cols-4">
              <Stat label="Releases" value={stats.releases || 0} />
              <Stat label="Reviews" value={stats.reviews || 0} />
              <Stat label="Guides" value={stats.guides || 0} />
              <Stat label="Articles" value={stats.articles || 0} />
            </dl>
          )}
          {accentSecondary !== accent && (
            <div
              className="mt-8 h-px w-24"
              style={{ backgroundColor: accentSecondary }}
              aria-hidden="true"
            />
          )}
        </div>
        {brand.image && (
          <div className="flex items-end justify-center px-5 pb-5 sm:px-10 lg:pb-0">
            <img
              src={optimizeImage(brand.image, 900)}
              alt={`${brand.name} logo`}
              fetchPriority="high"
              decoding="async"
              className="w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default BrandHero;
