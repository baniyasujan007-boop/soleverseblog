import Card from "../common/Card/Card";

function BrandCard({ brand }) {
  return (
    <Card className="flex h-24 items-center justify-center rounded-none border-b border-r border-black/10 p-4 text-center shadow-none transition-colors hover:bg-[#eee0c9]">
      {brand.image ? <img src={brand.image} alt={brand.name} loading="lazy" className="max-h-14 max-w-[75%] object-contain"/> : <h3 className="text-lg font-black">{brand.name}</h3>}
    </Card>
  );
}

export default BrandCard;
