import { Link } from "react-router-dom";

function SectionTitle({ title, action, to = "#" }) {
  return (
    <div className="mb-5 flex items-center justify-between border-b border-black/15 pb-4">
      <h2 className="text-lg font-black uppercase tracking-[-.035em]">{title}</h2>

      {action && (
        <Link
          to={to}
          className="text-xs font-semibold text-black transition hover:opacity-55"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export default SectionTitle;
