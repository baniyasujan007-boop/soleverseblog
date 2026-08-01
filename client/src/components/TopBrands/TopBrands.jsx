import BrandCard from "./BrandCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function TopBrands({ brands = [], settings = {} }) {
  if (!brands.length) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-8 sm:px-10 sm:py-10">
      <SectionTitle
        title={settings.title || "Top Brands"}
        action={settings.buttonText || "View All →"}
        to={settings.buttonUrl || "/brands"}
      />

      <div className="grid grid-cols-2 gap-0 border-l border-t border-black/10 md:grid-cols-3 lg:grid-cols-6">
        {brands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={{ ...brand, name: brand.title }}
          />
        ))}
      </div>
    </section>
  );
}

export default TopBrands;
