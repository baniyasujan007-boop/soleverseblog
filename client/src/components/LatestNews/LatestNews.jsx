import NewsCard from "./NewsCard";
import EditorialSection from "../common/EditorialSection/EditorialSection";

function LatestNews({ articles = [], settings = {} }) {
  if (!articles.length) return null;
  return (
    <EditorialSection
      kicker="News desk"
      title={settings.title || "Latest News"}
      action={settings.buttonText || "View all →"}
      to={settings.buttonUrl || "/news"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
    </EditorialSection>
  );
}

export default LatestNews;
