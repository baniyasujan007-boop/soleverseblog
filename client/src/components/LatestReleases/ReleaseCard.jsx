import Card from "../common/Card/Card";
import { Link } from "react-router-dom";

function ReleaseCard({ release }) {
  return (
    <Link to={`/release/${release.id}`} className="block h-full">
      <Card className="h-full overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex flex-col h-full">
          <img
            src={release.image}
            alt={release.name}
            loading="lazy" className="h-28 w-full object-contain p-2 sm:h-36"
          />

          <div className="flex flex-col flex-1 p-3 pt-1 sm:p-4 sm:pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/50">
              {release.brand}
            </p>

            <h3 className="mt-1 text-sm font-bold leading-5 line-clamp-2">
              {release.name}
            </h3>

            {release.price && <p className="mt-2 text-xs font-semibold text-black">{release.price}</p>}
            <p className="mt-3 text-[10px] text-black/50">{release.releaseDate ? new Date(release.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Coming soon"}</p>
            <span className="mt-3 bg-black py-2 text-center text-[9px] font-bold uppercase text-white">View details</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ReleaseCard; 
