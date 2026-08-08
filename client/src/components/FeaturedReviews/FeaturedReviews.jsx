import ReviewCard from "../Reviews/ReviewCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";
import { ReviewGridSkeleton } from "../common/Skeleton/Skeleton";
import { normalizeReview } from "../../utils/review";

const DEFAULT_COUNT = 3;

function FeaturedReviews({ reviews = [], settings = {}, loading = false }) {
  const count = Number(settings.limit) || DEFAULT_COUNT;
  const items = reviews
    .map(normalizeReview)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.overall || 0) - (a.overall || 0);
    })
    .slice(0, count);

  if (loading) {
    return (
      <EditorialSection
        kicker="Researched & tested"
        title={settings.title || "Featured Reviews"}
        action={settings.buttonText || "View all reviews →"}
        to={settings.buttonUrl || "/reviews"}
      >
        <ReviewGridSkeleton count={count} />
      </EditorialSection>
    );
  }
  if (!items.length) return null;

  return (
    <EditorialSection
      kicker="Researched & tested"
      title={settings.title || "Featured Reviews"}
      action={settings.buttonText || "View all reviews →"}
      to={settings.buttonUrl || "/reviews"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </EditorialSection>
  );
}

export default FeaturedReviews;
