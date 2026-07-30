import Card from "../common/Card/Card";

function BrandCard({ brand }) {
  return (
    <Card className="flex h-28 items-center justify-center p-4 text-center transition-transform hover:-translate-y-1">
      {brand.image ? <img src={brand.image} alt={brand.name} loading="lazy" className="max-h-14 max-w-[75%] object-contain"/> : <h3 className="text-lg font-black">{brand.name}</h3>}
    </Card>
  );
}

export default BrandCard;
