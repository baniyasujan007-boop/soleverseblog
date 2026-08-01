import NewsCard from "./NewsCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

function LatestNews({ articles = [], settings = {} }) {
  if (!articles.length) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
      <SectionTitle
        title={settings.title || "Latest News"}
        action={settings.buttonText || "View All →"}
        to={settings.buttonUrl || "/news"}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
