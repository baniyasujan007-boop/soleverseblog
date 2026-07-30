import Card from "../common/Card/Card";
import { Link } from "react-router-dom";

function NewsCard({ article }) {
  const publishedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/article/${article._id}`}>
      <Card className="rounded-2xl">
        <img
          src={article.image || "https://placehold.co/800x500/f1f5f9/475569?text=SoleVerse"}
          alt={article.title}
          loading="lazy" className="h-52 w-full object-cover"
        />

        <div className="p-5">
          <span className="text-red-600 text-sm font-semibold uppercase">
            {article.category || "Sneaker news"}
          </span>

          <h3 className="mt-3 text-xl font-bold leading-7">
            {article.title}
          </h3>

          <p className="mt-4 text-gray-500 text-sm">
            {article.author?.name || "SoleVerse"} • {article.readTime || "4 min read"} • {publishedDate}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default NewsCard;
