import NewsCard from "./NewsCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function LatestNews({ articles = [] }) {
  if (!articles.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionTitle
        title="Latest News"
        action="View All →"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <NewsCard
            key={article._id}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}

export default LatestNews;
