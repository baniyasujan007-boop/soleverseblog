import { useCallback, useEffect, useState } from "react";
import {
  FiEdit2,
  FiImage,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import api from "../../api/axios";
import { useAdmin } from "../context/AdminContext";
import { useToast } from "./Toast";

const date = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Loader = () => (
  <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
);
const Empty = ({ children }) => (
  <div className="py-16 text-center text-sm text-slate-500">{children}</div>
);
const PageTitle = ({ title, text, action }) => (
  <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
    {action}
  </div>
);

export function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data: result }) => setData(result.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load dashboard"),
      );
  }, []);
  if (error)
    return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>;
  if (!data) return <Loader />;
  const stats = [
    ["Articles", data.articles, "bg-indigo-50 text-indigo-700"],
    ["Featured", data.featured, "bg-amber-50 text-amber-700"],
    ["Categories", data.categories, "bg-emerald-50 text-emerald-700"],
    ["Users", data.users, "bg-violet-50 text-violet-700"],
    ["Other content", data.content, "bg-sky-50 text-sky-700"],
    ["Subscribers", data.subscribers, "bg-pink-50 text-pink-700"],
  ];
  return (
    <>
      <PageTitle
        title="Dashboard"
        text="A live overview of your publishing workspace."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value, color]) => (
          <div key={label} className={`rounded-2xl p-5 ${color}`}>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold">Recent articles</h3>
        </div>
        {data.recentArticles.length ? (
          <div className="divide-y divide-slate-100">
            {data.recentArticles.map((article) => (
              <div
                key={article._id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <img
                  src={article.image}
                  alt=""
                  className="h-11 w-11 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{article.title}</p>
                  <p className="text-xs text-slate-500">
                    {article.author?.name} · {date(article.createdAt)}
                  </p>
                </div>
                {article.featured && (
                  <FiStar className="fill-amber-400 text-amber-400" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty>No articles yet.</Empty>
        )}
      </section>
    </>
  );
}

function ArticleForm({ article, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: article?.title || "",
    content: article?.content || "",
    category: article?.category || "",
    tags: article?.tags?.join(", ") || "",
    status: article?.status || "draft",
    featured: article?.featured || false,
  });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      body.append(key, key === "featured" ? String(value) : value),
    );
    if (image) body.append("image", image);
    try {
      const response = article
        ? await api.put(`/articles/${article._id}`, body)
        : await api.post("/articles", body);
      toast(article ? "Article updated" : "Article published");
      onSaved(response.data.data);
      onClose();
    } catch (err) {
      toast(err.response?.data?.message || "Could not save article", "error");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-3 sm:p-8">
      <form
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-black">
            {article ? "Edit article" : "New article"}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-500">
            Cancel
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="field"
            />
          </label>
          <label className="text-sm font-medium">
            Category
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="field"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Tags{" "}
            <span className="font-normal text-slate-400">
              (comma separated)
            </span>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="field"
            />
          </label>
          <label className="text-sm font-medium">
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="field"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="sm:col-span-2 text-sm font-medium">
            Content
            <textarea
              required
              rows="8"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="field resize-y"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-medium sm:col-span-2">
            <FiImage className="text-indigo-600" size={20} />
            <span>
              {image
                ? image.name
                : article
                  ? "Choose a new image to replace the current one"
                  : "Choose article image"}
            </span>
            <input
              required={!article}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-indigo-600"
            />
            Feature this article
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="border border-slate-200"
          >
            Cancel
          </Button>
          <Button disabled={saving} className="bg-indigo-600 text-white">
            {saving ? "Saving…" : "Save article"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function Articles() {
  const [articles, setArticles] = useState([]),
    [categories, setCategories] = useState([]),
    [meta, setMeta] = useState({ page: 1, totalPages: 1, totalArticles: 0 }),
    [query, setQuery] = useState({
      search: "",
      category: "",
      sort: "newest",
      page: 1,
    }),
    [loading, setLoading] = useState(true),
    [editor, setEditor] = useState(null);
  const toast = useToast();
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data }, categoryResponse] = await Promise.all([
        api.get("/articles", { params: { ...query, limit: 10 } }),
        api.get("/categories"),
      ]);
      setArticles(data.data);
      setMeta(data);
      setCategories(categoryResponse.data.data);
    } catch (err) {
      toast(err.response?.data?.message || "Could not load articles", "error");
    } finally {
      setLoading(false);
    }
  }, [query, toast]);
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);
  const remove = async (article) => {
    if (!window.confirm(`Delete “${article.title}”?`)) return;
    try {
      await api.delete(`/articles/${article._id}`);
      toast("Article deleted");
      load();
    } catch (err) {
      toast(err.response?.data?.message || "Could not delete article", "error");
    }
  };
  const toggle = async (article) => {
    try {
      const { data } = await api.put(`/articles/${article._id}`, {
        featured: !article.featured,
      });
      setArticles((items) =>
        items.map((item) => (item._id === article._id ? data.data : item)),
      );
      toast(article.featured ? "Removed from featured" : "Marked as featured");
    } catch {
      toast("Could not update article", "error");
    }
  };
  return (
    <>
      <PageTitle
        title="Articles"
        text={`${meta.totalArticles || 0} articles in your library.`}
        action={
          <Button
            onClick={() => setEditor("new")}
            className="bg-indigo-600 text-white"
          >
            <FiPlus />
            New article
          </Button>
        }
      />
      <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            placeholder="Search articles"
            value={query.search}
            onChange={(e) =>
              setQuery({ ...query, search: e.target.value, page: 1 })
            }
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </label>
        <select
          value={query.category}
          onChange={(e) =>
            setQuery({ ...query, category: e.target.value, page: 1 })
          }
          className="rounded-xl border border-slate-200 px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={query.sort}
          onChange={(e) =>
            setQuery({ ...query, sort: e.target.value, page: 1 })
          }
          className="rounded-xl border border-slate-200 px-3 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <Loader />
        ) : !articles.length ? (
          <Empty>No matching articles.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Article</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Published</th>
                  <th className="px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.image}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="max-w-56">
                          <p className="truncate font-semibold">
                            {article.title}
                          </p>
                          {article.featured && (
                            <span className="text-xs font-medium text-amber-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{article.author?.name}</td>
                    <td>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                        {article.category}
                      </span>
                    </td>
                    <td>{date(article.createdAt)}</td>
                    <td className="px-5">
                      <div className="flex gap-1">
                        <button
                          title="Toggle featured"
                          onClick={() => toggle(article)}
                          className={`rounded-lg p-2 ${article.featured ? "text-amber-500" : "text-slate-400"}`}
                        >
                          <FiStar
                            className={article.featured ? "fill-amber-400" : ""}
                          />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => setEditor(article)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => remove(article)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {meta.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={meta.page <= 1}
              onClick={() => setQuery({ ...query, page: meta.page - 1 })}
              className="border border-slate-200"
            >
              Previous
            </Button>
            <Button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setQuery({ ...query, page: meta.page + 1 })}
              className="border border-slate-200"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {editor && (
        <ArticleForm
          article={editor === "new" ? null : editor}
          categories={categories}
          onClose={() => setEditor(null)}
          onSaved={load}
        />
      )}
    </>
  );
}

export function Categories() {
  const [categories, setCategories] = useState([]),
    [name, setName] = useState(""),
    [editing, setEditing] = useState(null),
    [loading, setLoading] = useState(true);
  const toast = useToast();
  const load = useCallback(
    () =>
      api
        .get("/categories")
        .then(({ data }) => setCategories(data.data))
        .catch(() => toast("Could not load categories", "error"))
        .finally(() => setLoading(false)),
    [toast],
  );
  useEffect(() => {
    load();
  }, [load]);
  const save = async (event) => {
    event.preventDefault();
    try {
      if (editing) await api.put(`/categories/${editing._id}`, { name });
      else await api.post("/categories", { name });
      toast(editing ? "Category updated" : "Category created");
      setName("");
      setEditing(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || "Could not save category", "error");
    }
  };
  const remove = async (category) => {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    try {
      await api.delete(`/categories/${category._id}`);
      toast("Category deleted");
      load();
    } catch (err) {
      toast(
        err.response?.data?.message || "Could not delete category",
        "error",
      );
    }
  };
  return (
    <>
      <PageTitle
        title="Categories"
        text="Create and organize article categories."
      />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={save}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h3 className="font-bold">
            {editing ? "Edit category" : "New category"}
          </h3>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sneaker news"
            className="field"
          />
          <div className="mt-4 flex gap-2">
            <Button className="bg-indigo-600 text-white">
              {editing ? "Save changes" : "Add category"}
            </Button>
            {editing && (
              <Button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setName("");
                }}
                className="border border-slate-200"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? (
            <Loader />
          ) : categories.length ? (
            <div className="divide-y divide-slate-100">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-xs text-slate-500">/{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditing(category);
                        setName(category.name);
                      }}
                      className="border border-slate-200"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => remove(category)}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty>No categories yet.</Empty>
          )}
        </div>
      </div>
    </>
  );
}

export function Users() {
  const [users, setUsers] = useState([]),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true);
  const toast = useToast();
  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/admin/users", { params: { search } })
      .then(({ data }) => setUsers(data.data))
      .catch(() => toast("Could not load users", "error"))
      .finally(() => setLoading(false));
  }, [search, toast]);
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);
  const changeRole = async (user, role) => {
    try {
      const { data } = await api.patch(`/admin/users/${user._id}/role`, {
        role,
      });
      setUsers((items) =>
        items.map((item) => (item._id === user._id ? data.data : item)),
      );
      toast("Role updated");
    } catch (err) {
      toast(err.response?.data?.message || "Could not update role", "error");
    }
  };
  return (
    <>
      <PageTitle title="Users" text="Manage administrator and reader access." />
      <div className="mb-5 max-w-md">
        <label className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <Loader />
        ) : users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th className="px-5">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td>{date(user.createdAt)}</td>
                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No matching users.</Empty>
        )}
      </div>
    </>
  );
}

export function Profile() {
  const { user, logout } = useAdmin();
  return (
    <>
      <PageTitle title="Profile" text="Your administrator account." />
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-700">
            {user?.name?.[0]}
          </span>
          <div>
            <h3 className="text-xl font-black">{user?.name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 border-t pt-5 text-sm">
          <div>
            <p className="text-slate-500">Role</p>
            <p className="mt-1 font-semibold capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-slate-500">Session</p>
            <p className="mt-1 font-semibold text-emerald-600">Active</p>
          </div>
        </div>
        <Button onClick={logout} className="mt-6 bg-slate-900 text-white">
          Sign out
        </Button>
      </div>
    </>
  );
}
