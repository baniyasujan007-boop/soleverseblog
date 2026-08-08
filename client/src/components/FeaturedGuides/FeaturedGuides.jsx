import GuideCard from "../Guides/GuideCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";
import { GuideGridSkeleton } from "../common/Skeleton/Skeleton";
import { normalizeGuide } from "../../utils/guide";

const DEFAULT_COUNT = 3;

function FeaturedGuides({ guides = [], settings = {}, loading = false }) {
  const count = Number(settings.limit) || DEFAULT_COUNT;
  const items = guides.map(normalizeGuide).slice(0, count);

  if (loading) {
    return (
      <EditorialSection
        size="tight"
        kicker="Know before you buy"
        title={settings.title || "Buying Guides"}
        action={settings.buttonText || "Browse guides →"}
        to={settings.buttonUrl || "/guides"}
      >
        <GuideGridSkeleton count={count} />
      </EditorialSection>
    );
  }
  if (!items.length) return null;

  return (
    <EditorialSection
      size="tight"
      kicker="Know before you buy"
      title={settings.title || "Buying Guides"}
      action={settings.buttonText || "Browse guides →"}
      to={settings.buttonUrl || "/guides"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </EditorialSection>
  );
}

export default FeaturedGuides;
