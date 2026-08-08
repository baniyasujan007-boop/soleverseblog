import HeroButtons from "./HeroButtons";

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return typeof value === "number"
    ? `$${value.toLocaleString("en-US")}`
    : String(value);
};

function HeroContent({ hero, settings = {} }) {
  const details = hero?.metadata || {};
  const summary = hero?.summary || hero?.content;
  const releaseDate = formatDate(details.releaseDate);
  const price = formatPrice(details.retailPrice ?? details.price);
  const meta = [
    details.brand ? { label: "Brand", value: details.brand } : null,
    releaseDate ? { label: "Release date", value: releaseDate } : null,
    price ? { label: "Retail price", value: price } : null,
  ].filter(Boolean);

  return (
    <div className="hero-text-col min-w-0">
      <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-[#eee0c9]">
        <span className="h-px w-8 bg-[#eee0c9]" aria-hidden="true" />
        {hero?.category || "Featured release"}
      </p>

      <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl xl:text-7xl">
        {hero?.title}
      </h1>

      {summary && (
        <p className="mt-5 max-w-md text-[15px] leading-6 text-white/70">
          {summary}
        </p>
      )}

      <HeroButtons hero={hero} settings={settings} />

      {meta.length > 0 && (
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-5">
          {meta.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                {item.label}
              </dt>
              <dd className="mt-1 text-xs font-bold uppercase tracking-wide text-[#eee0c9]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export default HeroContent;
