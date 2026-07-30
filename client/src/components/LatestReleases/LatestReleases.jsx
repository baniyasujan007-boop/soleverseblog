import ReleaseCard from "./ReleaseCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function LatestReleases({ releases = [] }) {
  if (!releases.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionTitle
        title="Latest Releases"
        action="View All →"
        to="/releases"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {releases.map((release) => (
          <ReleaseCard
            key={release._id}
            release={{ ...release, id: release._id, name: release.title, brand: release.metadata?.brand || release.category, price: release.metadata?.retailPrice || release.metadata?.price, releaseDate: release.metadata?.releaseDate }}
          />
        ))}
      </div>
    </section>
  );
}

export default LatestReleases;
