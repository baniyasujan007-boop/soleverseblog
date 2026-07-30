import SectionTitle from "../common/SectionTitle/SectionTitle";
import { Link } from "react-router-dom";

function Trending({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionTitle title="Trending Now" action="View all →" to="/news" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item, index) => (
          <Link to={`/article/${item._id}`}
            key={item._id}
            className="group relative overflow-hidden rounded-2xl bg-slate-950 text-white"
          >
            <img src={item.image || "https://placehold.co/500x300/111827/ffffff?text=SoleVerse"} alt="" loading="lazy" className="h-28 w-full object-cover opacity-70 transition group-hover:scale-105"/><span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-red-600 text-xs font-black">{index + 1}</span><h3 className="p-3 text-sm font-bold leading-5">{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Trending;
