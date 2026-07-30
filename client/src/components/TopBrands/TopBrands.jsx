import BrandCard from "./BrandCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function TopBrands({ brands = [] }) {
  if (!brands.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionTitle
        title="Top Brands"
        action="View All →"
        to="/brands"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
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
