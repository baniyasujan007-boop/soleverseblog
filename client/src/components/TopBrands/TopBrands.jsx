import BrandCard from "./BrandCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";

function TopBrands({ brands = [], settings = {} }) {
  if (!brands.length) return null;
  return (
    <EditorialSection
      size="tight"
      kicker="Brand index"
      title={settings.title || "Top Brands"}
      action={settings.buttonText || "View all →"}
      to={settings.buttonUrl || "/brands"}
    >
      <div className="grid grid-cols-2 gap-0 border-l border-t border-black/10 md:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={{ ...brand, name: brand.title }}
          />
        ))}
      </div>
    </EditorialSection>
  );
}

export default TopBrands;
