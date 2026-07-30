import Card from "../common/Card/Card";
import { Link } from "react-router-dom";

function ReleaseCard({ release }) {
  return (
    <Link to={`/release/${release.id}`} className="block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex flex-col h-full">
          <img
            src={release.image}
            alt={release.name}
            loading="lazy" className="h-32 w-full object-cover sm:h-40"
          />

          <div className="flex flex-col flex-1 p-3 sm:p-4">
            <p className="text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
              {release.brand}
            </p>

            <h3 className="mt-2 text-lg sm:text-xl font-bold line-clamp-2">
              {release.name}
            </h3>

            {release.price && <p className="mt-2 text-sm font-semibold text-gray-900">{release.price}</p>}
            <p className="mt-3 text-xs text-gray-500">{release.releaseDate ? new Date(release.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Coming soon"}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ReleaseCard; 
