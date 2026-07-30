import HeroButtons from "./HeroButtons";

function HeroContent({ hero }) {
  return (
    <div>
      <span className="text-red-600 uppercase font-bold tracking-widest">
        {hero?.category || "SoleVerse"}
      </span>

      <h1 className="mt-4 text-5xl font-black leading-tight">
        {hero?.title || "The latest in sneaker culture"}
      </h1>

      <h2 className="mt-2 text-3xl text-gray-500">
        {hero?.summary}
      </h2>

      <p className="mt-6 text-gray-600 leading-8">
        {hero?.content}
      </p>

      <HeroButtons />
    </div>
  );
}

export default HeroContent;
