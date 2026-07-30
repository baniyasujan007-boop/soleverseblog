function HeroImage({ hero }) {
  if (!hero?.image) {
    return (
      <div className="flex items-center justify-center h-80 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Sneaker image coming soon</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <img
        src={hero.image}
        alt={hero.title}
        className="w-full max-w-lg object-contain transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

export default HeroImage;
