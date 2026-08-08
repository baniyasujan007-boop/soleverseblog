import DealCard from "../Deals/DealCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";
import { DealGridSkeleton } from "../common/Skeleton/Skeleton";
import { normalizeDeal } from "../../utils/deal";

const DEFAULT_COUNT = 4;

function BestDeals({ deals = [], settings = {}, loading = false }) {
  const count = Number(settings.limit) || DEFAULT_COUNT;
  const tone = settings.backgroundColor ? "transparent" : "dark";
  const items = deals
    .map(normalizeDeal)
    .filter((deal) => !deal.expired && deal.availability !== "Out of Stock")
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.discountPercentage || 0) - (a.discountPercentage || 0);
    })
    .slice(0, count);

  if (loading) {
    return (
      <EditorialSection
        tone={tone}
        kicker="Hand-picked prices"
        title={settings.title || "Best Deals"}
        action={settings.buttonText || "View all deals →"}
        to={settings.buttonUrl || "/deals"}
      >
        <DealGridSkeleton count={count} />
      </EditorialSection>
    );
  }
  if (!items.length) return null;

  return (
    <EditorialSection
      tone={tone}
      kicker="Hand-picked prices"
      title={settings.title || "Best Deals"}
      action={settings.buttonText || "View all deals →"}
      to={settings.buttonUrl || "/deals"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </EditorialSection>
  );
}

export default BestDeals;
