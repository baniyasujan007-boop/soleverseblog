import { Link } from "react-router-dom";
import { optimizeImage } from "../../utils/image";
import EditorialSection from "../common/EditorialSection/EditorialSection";

function Trending({ items = [], settings = {} }) {
  if (!items.length) return null;
  return (
    <EditorialSection
      tone="dark"
      kicker="Trending now"
      title={settings.title || "Trending Now"}
      action={settings.buttonText || "View all →"}
      to={settings.buttonUrl || "/news"}
    >
      <div className="divide-y divide-white/10">
        {items.map((item, index) => (
          <Link
            to={`/article/${item._id}`}
            key={item._id}
            className="group flex items-center gap-4 py-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eee0c9] text-xs font-black text-black">
              {index + 1}
            </span>
            <img
              src={optimizeImage(item.image, 300)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-12 w-16 shrink-0 object-cover transition duration-500 group-hover:opacity-80"
            />
            <h3 className="min-w-0 flex-1 truncate text-sm font-bold leading-5">
              {item.title}
            </h3>
            <span className="shrink-0 text-[10px] uppercase text-white/50">
              Trending
            </span>
          </Link>
        ))}
      </div>
    </EditorialSection>
  );
}

export default Trending;
