import ReleaseCard from "./ReleaseCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function LatestReleases({ releases = [], settings = {} }) {
  if (!releases.length) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-8 sm:px-10 sm:py-10">
      <SectionTitle
        title={settings.title || "Latest Releases"}
        action={settings.buttonText || "View All →"}
        to={settings.buttonUrl || "/releases"}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
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
