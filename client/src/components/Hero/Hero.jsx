import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import HeroContent from "./HeroContent";
import UpcomingReleaseSidebar from "./UpcomingReleaseSidebar";
import "./Hero.css";

function Hero({ slides = [], releases = [], settings = {} }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const duration = Math.max(Number(settings.sliderSpeed) || 6000, 2000);

  const goTo = useCallback(
    (index) => {
      if (count < 2) return;
      setCurrent(((index % count) + count) % count);
    },
    [count],
  );

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);
  const resumeOnBlur = useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  }, []);

  const onKeys = useCallback(
    (event) => {
      if (event.target.tagName !== "BUTTON") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1);
      }
    },
    [current, goTo],
  );

  const autoPlay =
    settings.autoPlay !== false && count > 1 && !prefersReducedMotion;

  useEffect(() => {
    if (!autoPlay || paused) return undefined;
    const timer = setInterval(
      () => setCurrent((value) => (value + 1) % count),
      duration,
    );
    return () => clearInterval(timer);
  }, [autoPlay, paused, count, duration, current]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setPaused(true);
      } else if (
        sectionRef.current &&
        !sectionRef.current.matches(":hover") &&
        !sectionRef.current.contains(document.activeElement)
      ) {
        setPaused(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  if (!count) return null;

  const safeCurrent = current % count;
  const active = slides[safeCurrent];
  const animation = settings.animation === "slide" ? "slide" : "fade";
  const backgroundImage = settings.backgroundImage || "";
  const hasBackground = Boolean(backgroundImage);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={settings.title || "Featured releases"}
      className="bg-[#050505] text-white"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resumeOnBlur}
      onKeyDown={onKeys}
    >
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="relative overflow-hidden border-b border-white/10 lg:border-b-0">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_38%,rgba(238,224,201,0.08),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_100%,rgba(255,255,255,0.04),transparent_45%)]" />
            {hasBackground && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: settings.overlayColor || "#050505",
                    opacity: (settings.overlayOpacity ?? 55) / 100,
                  }}
                />
              </>
            )}
          </div>

          <div
            key={current}
            data-hero-animation={animation}
            className="relative z-10 mx-auto flex min-h-[520px] flex-col justify-center px-5 py-12 sm:px-10 lg:min-h-[620px] lg:px-12"
          >
            <div
              role="group"
              aria-roledescription="slide"
              aria-label={active.title}
            >
              <HeroContent
                hero={active}
                settings={settings}
                imagePriority={safeCurrent === 0}
              />
            </div>
          </div>

          {count > 1 && (
            <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-10 lg:px-12">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span
                  className="hero-progress-stitch"
                  aria-hidden="true"
                />
                <div
                  key={safeCurrent}
                  className={`hero-progress-track ${
                    paused ? "is-paused" : ""
                  } ${!autoPlay ? "is-static" : ""}`}
                  style={{ "--hero-progress-duration": `${duration}ms` }}
                >
                  <div className="hero-progress-fill" />
                </div>
                <span
                  className="hero-progress-flag"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="text-[11px] font-bold tabular-nums tracking-widest text-white/45"
                >
                  {String(safeCurrent + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => goTo(safeCurrent - 1)}
                  aria-label="Previous slide"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(safeCurrent + 1)}
                  aria-label="Next slide"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </article>

        <UpcomingReleaseSidebar releases={releases} />
      </div>
    </section>
  );
}

export default Hero;
