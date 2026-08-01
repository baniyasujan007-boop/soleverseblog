import SectionTitle from "../common/SectionTitle/SectionTitle";
import { Link } from "react-router-dom";

function Trending({ items = [], settings = {} }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
      <SectionTitle title={settings.title || "Trending Now"} action={settings.buttonText || "View all →"} to={settings.buttonUrl || "/news"} />

      <div className="divide-y divide-black/10 border-t border-black/10">
        {items.map((item, index) => (
          <Link to={`/article/${item._id}`}
            key={item._id}
            className="group flex items-center gap-4 py-3 text-black"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black text-xs font-black text-white">{index + 1}</span><img src={item.image || "https://placehold.co/500x300/111827/ffffff?text=SoleVerse"} alt="" loading="lazy" className="h-12 w-16 object-cover"/><h3 className="flex-1 text-sm font-bold leading-5">{item.title}</h3><span className="text-[10px] uppercase text-black/50">Trending</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Trending;
