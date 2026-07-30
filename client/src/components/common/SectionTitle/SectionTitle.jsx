import { Link } from "react-router-dom";

function SectionTitle({ title, action, to = "#" }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-black">{title}</h2>

      {action && (
        <Link
          to={to}
          className="text-red-600 font-semibold hover:underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export default SectionTitle;