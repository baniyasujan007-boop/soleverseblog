import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ContentDetail({ type, back }) {
  const { id } = useParams(); const [item, setItem] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get(`/content/public/${type}/${id}`).then(({ data }) => setItem(data.data)).catch(() => setError("Content not found")); }, [id, type]);
  if (error) return <main className="py-20 text-center"><h1 className="text-4xl font-bold">{error}</h1></main>;
  if (!item) return <main className="py-20 text-center text-gray-500">Loading…</main>;
  return <article className="mx-auto max-w-5xl px-6 py-16"><Link to={back} className="font-semibold text-red-600">← Back</Link><span className="mt-8 block font-semibold uppercase text-red-600">{item.category || type}</span><h1 className="mt-4 text-5xl font-black">{item.title}</h1>{item.image && <img src={item.image} alt={item.title} className="mt-10 h-[450px] w-full rounded-2xl object-cover"/>}<p className="mt-10 text-xl text-gray-500">{item.summary}</p><div className="mt-8 whitespace-pre-line text-lg leading-8 text-gray-700">{item.content}</div></article>;
}
