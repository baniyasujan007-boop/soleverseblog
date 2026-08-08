import { optimizeImage } from "../../utils/image";

function HeroImage({ hero, priority = false }) {
  if (!hero?.image) {
    return (
      <div
        aria-hidden="true"
        className="hero-image-col relative mx-auto grid h-[260px] w-full max-w-[520px] place-items-center rounded border border-white/10 bg-white/[0.03] sm:h-[340px] lg:h-[460px]"
      >
        <span className="text-lg font-black uppercase tracking-[0.4em] text-white/25">
          SoleVerse
        </span>
      </div>
    );
  }

  return (
    <div className="hero-image-col relative mx-auto h-[260px] w-full max-w-[520px] sm:h-[340px] lg:h-[460px]">
      <div
        aria-hidden="true"
        className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(238,224,201,0.10),transparent_62%)]"
      />
      <img
        src={optimizeImage(hero.image, 1200)}
        alt={hero.title}
        decoding="async"
        loading="eager"
        fetchPriority={priority ? "high" : "auto"}
        className="relative h-full w-full object-contain drop-shadow-[0_24px_20px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}

export default HeroImage;
