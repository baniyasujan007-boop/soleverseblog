import { useEffect, useState } from "react";
import NewsCard from "../../components/LatestNews/NewsCard";
import api from "../../api/axios";

export default function Search() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return undefined;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/articles", {
          params: { search: query, status: "published", limit: 12 },
        });
        if (!cancelled) setItems(data.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (!value.trim()) {
      setItems([]);
      setLoading(false);
    }
  };

  return <main className="mx-auto max-w-7xl px-6 py-16"><h1 className="text-4xl font-black">Search</h1><input value={query} onChange={handleQueryChange} placeholder="Search SoleVerse…" className="mt-6 w-full rounded-xl border p-4"/>{loading ? <p className="py-12 text-center text-gray-500">Searching…</p> : <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <NewsCard key={item._id} article={item}/>)}</div>}{query && !loading && !items.length && <p className="py-12 text-center text-gray-500">No results found.</p>}</main>;
}
