import Card from "../common/Card/Card";
import { Link } from "react-router-dom";
import { optimizeImage } from "../../utils/image";

function BrandCard({ brand }) {
  return (
    <Link
      to={`/brand/${brand._id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#080808]"
    >
      <Card className="flex h-24 items-center justify-center rounded-none border-b border-r border-black/10 p-4 text-center shadow-none transition-colors hover:bg-[#eee0c9]">
        {brand.image ? (
          <img
            src={optimizeImage(brand.image, 200)}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            className="max-h-14 max-w-[75%] object-contain"
          />
        ) : (
          <span className="text-lg font-black">{brand.name}</span>
        )}
      </Card>
    </Link>
  );
}

export default BrandCard;
