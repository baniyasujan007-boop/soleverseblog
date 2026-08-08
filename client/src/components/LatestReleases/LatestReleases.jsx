import ReleaseCard from "./ReleaseCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";

function LatestReleases({ releases = [], settings = {} }) {
  if (!releases.length) return null;
  return (
    <EditorialSection
      size="tight"
      kicker="The drop"
      title={settings.title || "Latest Releases"}
      action={settings.buttonText || "View all →"}
      to={settings.buttonUrl || "/releases"}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {releases.map((release) => (
          <ReleaseCard
            key={release._id}
            release={{
              ...release,
              id: release._id,
              name: release.title,
              brand: release.metadata?.brand || release.category,
              price: release.metadata?.retailPrice || release.metadata?.price,
              releaseDate: release.metadata?.releaseDate,
            }}
          />
        ))}
      </div>
    </EditorialSection>
  );
}

export default LatestReleases;
