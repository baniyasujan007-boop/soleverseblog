import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";

function GuideContent({ guide, releaseMatches = {} }) {
  const takeaways = guide.keyTakeaways || [];
  const models = guide.recommendedModels || [];

  return (
    <div className="min-w-0 space-y-12">
      {takeaways.length > 0 && (
        <section aria-label="Key takeaways">
          <h2 className="text-2xl font-black tracking-[-0.045em]">
            Key Takeaways
          </h2>
          <ul className="mt-5 space-y-3">
            {takeaways.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm leading-6 text-black/80"
              >
                <FiCheck
                  className="mt-1 shrink-0 text-black"
                  size={15}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.content && (
        <section aria-label="Guide content">
          <h2 className="text-2xl font-black tracking-[-0.045em]">The Guide</h2>
          <div className="mt-5 whitespace-pre-line text-lg leading-8 text-black/80">
            {guide.content}
          </div>
        </section>
      )}

      {models.length > 0 && (
        <section aria-label="Recommended models">
          <h2 className="text-2xl font-black tracking-[-0.045em]">
            Recommended Models
          </h2>
          <ul className="mt-5 space-y-2">
            {models.map((model, index) => {
              const match = releaseMatches[model];
              return (
                <li key={index}>
                  {match ? (
                    <Link
                      to={`/release/${match.id}`}
                      className="group inline-flex items-center gap-2 border-b border-black/20 pb-0.5 text-sm font-semibold text-black transition hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                    >
                      {model}
                      <FiArrowRight
                        size={13}
                        className="transition group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-black/80">
                      {model}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export default GuideContent;
