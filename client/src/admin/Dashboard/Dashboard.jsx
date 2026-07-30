import { useEffect, useState } from "react";
import { FiArrowRight, FiBookOpen, FiCalendar, FiChevronDown, FiEye, FiMoreVertical, FiStar, FiUsers } from "react-icons/fi";
import { BsChatSquareText, BsGraphUpArrow } from "react-icons/bs";
import api from "../../api/axios";

const compact = (number = 0) => number >= 1000 ? `${(number / 1000).toFixed(number >= 10000 ? 1 : 0)}K` : number;
const items = [
  ["Total Articles", "articles", FiBookOpen, "violet"], ["Upcoming Releases", "content", FiCalendar, "green"],
  ["Reviews Published", "featured", FiStar, "orange"], ["Total Comments", "users", BsChatSquareText, "blue"],
  ["Newsletter Subscribers", "subscribers", FiUsers, "pink"],
];
const labels = ["May 20", "May 21", "May 22", "May 23", "May 24", "May 25", "May 26"];
const fallbackImage = "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=100&q=80";

function LineChart() {
  const page = [57, 49, 61, 66, 60, 64, 78]; const sessions = [29, 23, 32, 36, 31, 35, 45];
  const points = (data) => data.map((value, i) => `${38 + i * 88},${183 - value * 1.65}`).join(" ");
  return <div className="dashboard-chart"><div className="chart-key"><span><i className="purple" />Page Views</span><span><i className="cyan" />Sessions</span></div><svg viewBox="0 0 580 230" preserveAspectRatio="none" aria-label="Website traffic chart">
    {[45, 80, 115, 150, 185].map(y => <line key={y} x1="38" x2="565" y1={y} y2={y} />)}
    <polyline className="page-line" points={points(page)} /><polyline className="sessions-line" points={points(sessions)} />
    {page.map((v, i) => <g key={`p${i}`}><circle className="page-dot" cx={38 + i * 88} cy={183 - v * 1.65} r="4" /><text x={38 + i * 88} y={174 - v * 1.65}>{`${(v / 2).toFixed(1)}K`}</text></g>)}
    {sessions.map((v, i) => <g key={`s${i}`}><circle className="session-dot" cx={38 + i * 88} cy={183 - v * 1.65} r="4" /><text x={38 + i * 88} y={197 - v * 1.65}>{`${(v / 2).toFixed(1)}K`}</text></g>)}
    {labels.map((label, i) => <text className="axis" key={label} x={38 + i * 88} y="218">{label}</text>)}
  </svg></div>;
}

export default function Dashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get("/admin/dashboard").then(({ data: result }) => setData(result.data)).catch(err => setError(err.response?.data?.message || "Could not load dashboard")); }, []);
  if (error) return <p className="admin-error">{error}</p>;
  if (!data) return <div className="admin-loading">Loading dashboard…</div>;
  const articles = data.recentArticles || []; const feature = articles.slice(0, 5);
  return <section className="dashboard">
    <div className="dashboard-heading"><div><h1>Dashboard</h1><p>Welcome back, <b>Super Admin!</b> Here’s what’s happening with SoleVerse.</p></div><button className="date-button"><FiCalendar /> May 20, 2024 - May 26, 2024 <FiChevronDown /></button></div>
    <div className="metric-grid">{items.map(([label, key, Icon, color], index) => <article className="metric-card" key={label}><span className={`metric-icon ${color}`}><Icon /></span><div><small>{label}</small><strong>{compact(data[key])}</strong><p><BsGraphUpArrow /> {index === 3 ? "18.7" : index === 4 ? "14.3" : index === 1 ? "8.4" : index === 2 ? "5.6" : "12.5"}% <span>from last 7 days</span></p></div></article>)}</div>
    <div className="dashboard-mid"><article className="dashboard-card website"><h2>Website Overview</h2><LineChart /></article><article className="dashboard-card top-content"><h2>Top Content by Views</h2>{feature.map((article, i) => <div className="content-rank" key={article._id}><p>{article.title}</p><strong>{compact(24500 - i * 3200)}</strong><i><b style={{ width: `${82 - i * 13}%` }} /></i></div>)}<a href="/admin/articles">View all articles <FiArrowRight /></a></article><article className="dashboard-card traffic"><h2>Traffic Sources</h2><div className="traffic-body"><div className="donut"><span><b>45,231</b><small>Total Visits</small></span></div><div className="traffic-legend"><p><i className="purple" />Organic Search <b>56.2%</b></p><p><i className="cyan" />Direct <b>24.1%</b></p><p><i className="green" />Social Media <b>10.4%</b></p><p><i className="orange" />Referral <b>6.8%</b></p><p><i className="pink" />Email <b>2.5%</b></p></div></div><a href="/admin/calendar">View full analytics <FiArrowRight /></a></article></div>
    <div className="dashboard-bottom"><article className="dashboard-card recent"><header><h2>Recent Articles</h2><a href="/admin/articles">View all articles</a></header><div className="article-table"><div className="table-head"><span>Title</span><span>Category</span><span>Author</span><span>Status</span><span>Views</span><span>Date</span></div>{articles.slice(0, 5).map((article, i) => <div className="article-row" key={article._id}><span className="article-title"><img src={article.image || fallbackImage} alt="" /><span><b>{article.title}</b><small>{article.content?.replace(/<[^>]*>/g, "").slice(0, 34) || "Official images & release date"}</small></span></span><em>{article.category || "News"}</em><span>{article.author?.name || "SoleVerse Team"}</span><strong><i />Published</strong><span>{compact(24500 - i * 3200)}</span><time>{`May ${26 - i}, 2024`}</time><FiMoreVertical /></div>)}</div></article><div className="right-stack"><article className="dashboard-card upcoming"><header><h2>Upcoming Releases</h2><a href="/admin/calendar">View calendar</a></header>{feature.slice(0, 4).map((article, i) => <div key={article._id}><img src={article.image || fallbackImage} alt="" /><b><small>JUN</small>{String(1 + i * 7).padStart(2, "0")}</b><p>{article.title}</p><em>In {6 + i * 7} days</em></div>)}</article><article className="dashboard-card quick"><h2>Quick Actions</h2><div><a href="/admin/articles"><FiBookOpen />Add Article</a><a href="/admin/releases"><FiCalendar />Add Release</a><a href="/admin/reviews"><FiStar />Add Review</a><a href="/admin/guides"><FiEye />Add Guide</a></div></article></div></div>
  </section>;
}
