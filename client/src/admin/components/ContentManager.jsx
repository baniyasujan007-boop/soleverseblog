import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiImage, FiPlus, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import api from "../../api/axios";
import { useToast } from "./Toast";

const formatDate = (value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const Button = ({ children, className = "", ...props }) => <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold disabled:opacity-50 ${className}`} {...props}>{children}</button>;

const schemaFields = (contentSchema) => (contentSchema || []).flatMap((group) => group.fields);

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const metadataFromSchema = (metadata, contentSchema) => {
  const record = {};
  schemaFields(contentSchema).forEach((field) => {
    const value = metadata?.[field.name] ?? "";
    record[field.name] = field.type === "date" ? toDateInputValue(value) : value;
  });
  return record;
};

function SelectField({ field, value, onChange }) {
  const options = field.options || [];
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      required={field.required}
      className="field"
    >
      <option value="" disabled>
        Select {field.label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
      {hasValue && !options.includes(value) && (
        <option value={value}>{value}</option>
      )}
    </select>
  );
}

function MetadataField({ field, value, onChange }) {
  if (field.type === "select") {
    return <SelectField field={field} value={value} onChange={onChange} />;
  }
  if (field.type === "number") {
    return (
      <input
        type="number"
        min={field.min ?? 0}
        max={field.max}
        step={field.step ?? 0.01}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        className="field"
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        rows={field.rows || 3}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="field resize-y"
      />
    );
  }
  if (field.type === "url") {
    return (
      <input
        type="url"
        placeholder="https://"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      />
    );
  }
  if (field.type === "color") {
    return (
      <input
        type="color"
        value={value || "#000000"}
        onChange={(event) => onChange(event.target.value)}
        className="field h-10 cursor-pointer"
      />
    );
  }
  if (field.type === "date") {
    return (
      <input
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        className="field"
      />
    );
  }
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      className="field"
    />
  );
}

function ContentForm({ item, type, label, onClose, onSaved, defaultSection = "", defaultStatus = "draft", contentSchema }) {
  const [form, setForm] = useState(() => ({
    title: item?.title || "",
    summary: item?.summary || "",
    content: item?.content || "",
    category: item?.category || "",
    section: item?.section || defaultSection,
    status: item?.status || defaultStatus,
    featured: item?.featured || false,
    metadata: contentSchema
      ? metadataFromSchema(item?.metadata, contentSchema)
      : JSON.stringify(item?.metadata || {}, null, 2),
  }));
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const setMetadata = (name, value) =>
    setForm((current) => ({
      ...current,
      metadata: { ...current.metadata, [name]: value },
    }));

  const buildMetadata = () => {
    const fields = schemaFields(contentSchema);
    const metadata = {};
    fields.forEach((field) => {
      const value = form.metadata[field.name];
      if (value === undefined || value === null || value === "") return;
      if (field.type === "number") {
        metadata[field.name] = Number(value);
      } else if (field.type === "date") {
        metadata[field.name] = new Date(`${value}T12:00:00`).toISOString();
      } else {
        metadata[field.name] = value;
      }
    });
    const original = item?.metadata || {};
    Object.keys(original).forEach((key) => {
      if (!fields.some((field) => field.name === key)) metadata[key] = original[key];
    });
    return metadata;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "metadata") {
        payload.append(key, contentSchema ? JSON.stringify(buildMetadata()) : value);
      } else {
        payload.append(key, key === "featured" ? String(value) : value);
      }
    });
    if (image) payload.append("image", image);
    try {
      const response = item ? await api.put(`/content/${type}/${item._id}`, payload) : await api.post(`/content/${type}`, payload);
      toast(item ? `${label} updated` : `${label} created`);
      onSaved(response.data.data);
      onClose();
    } catch (error) {
      toast(error.response?.data?.message || `Could not save ${label.toLowerCase()}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-3 sm:p-8">
      <form onSubmit={submit} className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-black">{item ? `Edit ${label}` : `New ${label}`}</h3>
          <button type="button" onClick={onClose} className="text-sm text-slate-500">
            Cancel
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="field" />
          </label>
          <label className="text-sm font-medium">
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="field" />
          </label>
          <label className="text-sm font-medium">
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="field">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          {type === "home" && (
            <label className="text-sm font-medium sm:col-span-2">
              Home section
              <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="field">
                <option value="hero">Hero</option>
                <option value="featured">Featured</option>
                <option value="trending">Trending</option>
                <option value="latest">Latest</option>
              </select>
            </label>
          )}
          <label className="text-sm font-medium sm:col-span-2">
            Summary
            <textarea rows="2" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="field resize-y" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Content
            <textarea rows="7" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="field resize-y" />
          </label>
          {contentSchema ? (
            <div className="space-y-5 sm:col-span-2">
              {contentSchema.map((group) => (
                <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="text-sm font-bold text-slate-700">{group.title}</h4>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {group.fields.map((field) => (
                      <label key={field.name} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-rose-500"> *</span>}
                        <MetadataField
                          field={field}
                          value={form.metadata[field.name]}
                          onChange={(value) => setMetadata(field.name, value)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <label className="text-sm font-medium sm:col-span-2">
              Module details <span className="font-normal text-slate-400">(JSON)</span>
              <textarea rows="3" value={form.metadata} onChange={(e) => setForm({ ...form, metadata: e.target.value })} className="field resize-y font-mono text-xs" />
            </label>
          )}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-medium sm:col-span-2">
            <FiImage className="text-indigo-600" size={20} />
            <span>
              {image ? image.name : item ? "Choose a new image to replace the current one" : "Choose an image"}
            </span>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
          </label>
          {contentSchema && (
            <p className="text-xs text-slate-400 sm:col-span-2">
              Recommended: 1600×1200 · PNG / JPG · Maximum 5 MB
            </p>
          )}
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-indigo-600" />
            Featured
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} className="border border-slate-200">
            Cancel
          </Button>
          <Button disabled={saving} className="bg-indigo-600 text-white">
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ContentManager({ type, title, description, defaultSection = "", defaultStatus = "draft", contentSchema }) {
  const [items, setItems] = useState([]), [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 }), [filters, setFilters] = useState({ search: "", status: "", sort: "newest", page: 1 }), [editor, setEditor] = useState(null), [loading, setLoading] = useState(true); const toast = useToast();
  const load = useCallback(async () => { setLoading(true); try { const { data } = await api.get(`/content/${type}`, { params: { ...filters, limit: 10 } }); setItems(data.data); setMeta(data); } catch (error) { toast(error.response?.data?.message || `Could not load ${title.toLowerCase()}`, "error"); } finally { setLoading(false); } }, [filters, title, toast, type]);
  useEffect(() => { const timer = setTimeout(load, 200); return () => clearTimeout(timer); }, [load]);
  const remove = async (item) => { if (!window.confirm(`Delete “${item.title}”?`)) return; try { await api.delete(`/content/${type}/${item._id}`); toast(`${title.slice(0, -1)} deleted`); load(); } catch (error) { toast(error.response?.data?.message || "Could not delete item", "error"); } };
  const toggle = async (item) => { try { const { data } = await api.put(`/content/${type}/${item._id}`, { featured: !item.featured }); setItems((all) => all.map((entry) => entry._id === item._id ? data.data : entry)); toast(item.featured ? "Removed from featured" : "Marked featured"); } catch { toast("Could not update item", "error"); } };
  return <><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><Button onClick={() => setEditor("new")} className="bg-indigo-600 text-white"><FiPlus/>New</Button></div><div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_auto_auto]"><label className="relative"><FiSearch className="absolute left-3 top-3 text-slate-400"/><input value={filters.search} onChange={(e) => setFilters({...filters,search:e.target.value,page:1})} placeholder={`Search ${title.toLowerCase()}`} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm"/></label><select value={filters.status} onChange={(e) => setFilters({...filters,status:e.target.value,page:1})} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select><select value={filters.sort} onChange={(e) => setFilters({...filters,sort:e.target.value,page:1})} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="az">Title A–Z</option><option value="za">Title Z–A</option></select></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">{loading ? <div className="py-16 text-center text-sm text-slate-500">Loading…</div> : !items.length ? <div className="py-16 text-center text-sm text-slate-500">No {title.toLowerCase()} yet.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Content</th><th>Status</th><th>Category</th><th>Updated</th><th className="px-5">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item._id}><td className="px-5 py-4"><div className="flex items-center gap-3">{item.image ? <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover"/> : <div className="h-10 w-10 rounded-lg bg-slate-100"/>}<div className="max-w-64"><p className="truncate font-semibold">{item.title}</p>{item.featured && <span className="text-xs text-amber-600">Featured</span>}</div></div></td><td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status}</span></td><td>{item.category || "—"}</td><td>{formatDate(item.updatedAt)}</td><td className="px-5"><div className="flex gap-1"><button onClick={() => toggle(item)} className={`rounded-lg p-2 ${item.featured ? "text-amber-500" : "text-slate-400"}`}><FiStar className={item.featured ? "fill-amber-400" : ""}/></button><button onClick={() => setEditor(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><FiEdit2/></button><button onClick={() => remove(item)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><FiTrash2/></button></div></td></tr>)}</tbody></table></div>}</div>{meta.totalPages > 1 && <div className="mt-5 flex items-center justify-between text-sm"><span>Page {meta.page} of {meta.totalPages}</span><div className="flex gap-2"><Button disabled={meta.page <= 1} onClick={() => setFilters({...filters,page:meta.page-1})} className="border border-slate-200">Previous</Button><Button disabled={meta.page >= meta.totalPages} onClick={() => setFilters({...filters,page:meta.page+1})} className="border border-slate-200">Next</Button></div></div>}{editor && <ContentForm key={editor === "new" ? "new" : editor._id} item={editor === "new" ? null : editor} type={type} label={title.slice(0, -1)} onClose={() => setEditor(null)} onSaved={load} defaultSection={defaultSection} defaultStatus={defaultStatus} contentSchema={contentSchema}/>}</>;
}
